import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import type { WeddingGuest, GuestRegistrationInput } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "wedding_guests.json");

// Ensure data directory and DB file exist without any mock data
function initDatabase(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

function getGuests(): WeddingGuest[] {
  try {
    initDatabase();
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data) as WeddingGuest[];
  } catch (err) {
    console.error("Error reading guests database:", err);
    return [];
  }
}

function saveGuests(guests: WeddingGuest[]): void {
  try {
    initDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(guests, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving guests database:", err);
  }
}

function generateInvitationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EG-2026-${randomPart}`;
}

const ADMIN_PASSWORDS = [
  process.env.ADMIN_PASSWORD,
  "elodie-gabriel-2026",
  "provence2026",
  "admin2026"
].filter(Boolean);

const ADMIN_TOKEN = "admin-session-eg2026-auth";

function isAdminAuthenticated(req: express.Request): boolean {
  const authHeader = req.headers["authorization"] || req.headers["x-admin-token"];
  const queryToken = req.query.adminToken;
  if (authHeader === `Bearer ${ADMIN_TOKEN}` || authHeader === ADMIN_TOKEN || queryToken === ADMIN_TOKEN) {
    return true;
  }
  return false;
}

// ---------------- API Routes ----------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Guest registration / RSVP submission
app.post("/api/guests", (req, res) => {
  try {
    const input = req.body as GuestRegistrationInput;
    if (!input.name || !input.name.trim()) {
      res.status(400).json({ error: "Le nom et prénom sont obligatoires pour générer l'invitation." });
      return;
    }

    const trimmedName = input.name.trim();
    const guests = getGuests();

    // Check if guest already exists by name or email to avoid unnecessary duplicates, or generate a fresh one
    const existingGuest = guests.find(
      g => g.name.toLowerCase() === trimmedName.toLowerCase() && 
           ((input.email && g.email && g.email.toLowerCase() === input.email.toLowerCase()) || !input.email)
    );

    const now = new Date().toISOString();

    if (existingGuest) {
      // Update existing record
      existingGuest.attendance = input.attendance || existingGuest.attendance || 'present';
      existingGuest.partySize = typeof input.partySize === 'number' ? Math.max(1, input.partySize) : existingGuest.partySize || 1;
      if (input.email !== undefined) existingGuest.email = input.email.trim();
      if (input.phone !== undefined) existingGuest.phone = input.phone.trim();
      if (input.dietaryNotes !== undefined) existingGuest.dietaryNotes = input.dietaryNotes.trim();
      if (input.accommodation !== undefined) existingGuest.accommodation = input.accommodation.trim();
      if (input.message !== undefined) existingGuest.message = input.message.trim();
      existingGuest.updatedAt = now;

      saveGuests(guests);
      res.json({
        guest: existingGuest,
        isExisting: true,
        message: "Votre invitation a été mise à jour avec succès."
      });
      return;
    }

    // Create new guest
    let invitationCode = generateInvitationCode();
    while (guests.some(g => g.invitationCode === invitationCode)) {
      invitationCode = generateInvitationCode();
    }

    const newGuest: WeddingGuest = {
      id: "guest_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name: trimmedName,
      email: (input.email || "").trim(),
      phone: (input.phone || "").trim(),
      attendance: input.attendance || "present",
      partySize: typeof input.partySize === "number" ? Math.max(1, input.partySize) : 1,
      dietaryNotes: (input.dietaryNotes || "").trim(),
      accommodation: (input.accommodation || "").trim(),
      message: (input.message || "").trim(),
      invitationCode,
      qrPayload: `MARIAGE-EG-2026|CODE:${invitationCode}|NOM:${trimmedName}|DATE:12-10-2026|LIEU:Bastide-des-Oliviers`,
      createdAt: now,
      updatedAt: now
    };

    guests.push(newGuest);
    saveGuests(guests);

    res.status(201).json({
      guest: newGuest,
      isExisting: false,
      message: "Votre invitation personnalisée a été générée avec succès."
    });
  } catch (err) {
    console.error("Error creating guest invitation:", err);
    res.status(500).json({ error: "Une erreur interne est survenue lors de la création de l'invitation." });
  }
});

// Lookup invitation by code or id
app.get("/api/guests/lookup", (req, res) => {
  try {
    const code = req.query.code as string;
    const id = req.query.id as string;
    if (!code && !id) {
      res.status(400).json({ error: "Code d'invitation ou identifiant manquant." });
      return;
    }

    const guests = getGuests();
    const guest = guests.find(g => 
      (code && g.invitationCode.toUpperCase() === code.toUpperCase().trim()) || 
      (id && g.id === id)
    );

    if (!guest) {
      res.status(404).json({ error: "Aucune invitation trouvée correspondant à ce code." });
      return;
    }

    res.json({ guest });
  } catch (err) {
    console.error("Error looking up guest:", err);
    res.status(500).json({ error: "Erreur lors de la recherche de l'invitation." });
  }
});

// Admin authentication login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: "Mot de passe requis." });
    return;
  }

  const isValid = ADMIN_PASSWORDS.includes(password.trim());
  if (isValid) {
    res.json({ success: true, token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Mot de passe administrateur incorrect." });
  }
});

// Admin: get all guests
app.get("/api/admin/guests", (req, res) => {
  if (!isAdminAuthenticated(req)) {
    res.status(403).json({ error: "Accès refusé. Authentification administrateur requise." });
    return;
  }

  const guests = getGuests();
  // Sort by createdAt descending
  guests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ guests });
});

// Admin: update guest
app.put("/api/admin/guests/:id", (req, res) => {
  if (!isAdminAuthenticated(req)) {
    res.status(403).json({ error: "Accès refusé." });
    return;
  }

  const { id } = req.params;
  const updates = req.body as Partial<WeddingGuest>;
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Invité non trouvé." });
    return;
  }

  const guest = guests[index];
  if (updates.name && updates.name.trim()) guest.name = updates.name.trim();
  if (updates.email !== undefined) guest.email = updates.email.trim();
  if (updates.phone !== undefined) guest.phone = updates.phone.trim();
  if (updates.attendance) guest.attendance = updates.attendance;
  if (typeof updates.partySize === "number") guest.partySize = Math.max(1, updates.partySize);
  if (updates.dietaryNotes !== undefined) guest.dietaryNotes = updates.dietaryNotes.trim();
  if (updates.accommodation !== undefined) guest.accommodation = updates.accommodation.trim();
  if (updates.message !== undefined) guest.message = updates.message.trim();
  guest.updatedAt = new Date().toISOString();

  guests[index] = guest;
  saveGuests(guests);

  res.json({ guest, message: "Invité mis à jour avec succès." });
});

// Admin: delete guest
app.delete("/api/admin/guests/:id", (req, res) => {
  if (!isAdminAuthenticated(req)) {
    res.status(403).json({ error: "Accès refusé." });
    return;
  }

  const { id } = req.params;
  const guests = getGuests();
  const newGuests = guests.filter(g => g.id !== id);

  if (newGuests.length === guests.length) {
    res.status(404).json({ error: "Invité non trouvé." });
    return;
  }

  saveGuests(newGuests);
  res.json({ success: true, message: "Invité supprimé avec succès." });
});

// Admin: stats
app.get("/api/admin/stats", (req, res) => {
  if (!isAdminAuthenticated(req)) {
    res.status(403).json({ error: "Accès refusé." });
    return;
  }

  const guests = getGuests();
  const totalRegistered = guests.length;
  const confirmedGuests = guests.filter(g => g.attendance === "present");
  const totalConfirmed = confirmedGuests.length;
  const totalAttendeesCount = confirmedGuests.reduce((sum, g) => sum + (g.partySize || 1), 0);
  const totalDeclined = guests.filter(g => g.attendance === "absent").length;
  const totalPending = guests.filter(g => g.attendance === "pending").length;

  res.json({
    totalRegistered,
    totalConfirmed,
    totalAttendeesCount,
    totalDeclined,
    totalPending
  });
});

// ---------------- Vite Middleware / Production Server ----------------

async function startServer() {
  initDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur de mariage démarré sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
