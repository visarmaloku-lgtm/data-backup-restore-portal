const PptxGenJS = require("pptxgenjs");
const path = require("path");

const pptx = new PptxGenJS();
pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
pptx.layout = "WIDE";

const BG = "0B1120";
const CARD = "1A2332";
const BORDER = "2D3A4E";
const BLUE = "2563EB";
const BLUE_LIGHT = "3B82F6";
const GREEN = "22C55E";
const RED = "EF4444";
const WHITE = "F8FAFC";
const GRAY = "94A3B8";
const SLATE = "475569";

function addSlide(title, items) {
  const slide = pptx.addSlide();
  slide.background = { fill: BG };

  // Left accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.08, h: 7.5, fill: { color: BLUE },
  });

  // Top gradient line
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 13.33, h: 0.04, fill: { color: BLUE },
  });

  // Title with icon background
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.5, y: 0.3, w: 12.33, h: 0.9, fill: { color: CARD },
    line: { color: BORDER, width: 0.5 }, rectRadius: 6,
  });
  slide.addText(title, {
    x: 0.8, y: 0.35, w: 11.5, h: 0.8,
    fontSize: 26, fontFace: "Arial", color: WHITE, bold: true, valign: "middle",
  });

  // Content
  let yPos = 1.5;
  if (items) {
    items.forEach((item) => {
      if (item.type === "list") {
        const lines = item.text.split("\n");
        const h = lines.length * 0.42;
        slide.addText(item.text, {
          x: 0.8, y: yPos, w: 11.5, h: h,
          fontSize: 14, fontFace: "Arial", color: GRAY, valign: "top",
          lineSpacingMultiple: 1.6, bullet: { code: "2022" },
        });
        yPos += h + 0.2;
      } else if (item.type === "card") {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: item.x || 0.8, y: yPos, w: item.w || 5.5, h: item.h || 1.2,
          fill: { color: CARD }, line: { color: BORDER, width: 0.8 }, rectRadius: 8,
        });
        slide.addText(item.title || "", {
          x: (item.x || 0.8) + 0.3, y: yPos + 0.1,
          w: (item.w || 5.5) - 0.6, h: 0.4,
          fontSize: 15, fontFace: "Arial", color: WHITE, bold: true,
        });
        slide.addText(item.desc || "", {
          x: (item.x || 0.8) + 0.3, y: yPos + 0.5,
          w: (item.w || 5.5) - 0.6, h: 0.5,
          fontSize: 12, fontFace: "Arial", color: GRAY,
        });
        yPos += item.h || 1.2;
        yPos += 0.15;
      } else if (item.type === "code") {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.8, y: yPos, w: 11.5, h: item.h || 0.8,
          fill: { color: "0F172A" }, line: { color: BORDER, width: 0.5 }, rectRadius: 6,
        });
        slide.addText(item.text || "", {
          x: 1.2, y: yPos + 0.05, w: 10.8, h: (item.h || 0.8) - 0.1,
          fontSize: 12, fontFace: "Consolas", color: GREEN, valign: "middle",
        });
        yPos += (item.h || 0.8) + 0.2;
      } else if (item.type === "title-sm") {
        slide.addText(item.text, {
          x: 0.8, y: yPos, w: 11.5, h: 0.5,
          fontSize: 18, fontFace: "Arial", color: BLUE_LIGHT, bold: true,
        });
        yPos += 0.6;
      }
    });
  }

  // Footer
  slide.addText("Data Backup & Restore Portal — Cloud & MCC — Tema 25", {
    x: 0.5, y: 7.0, w: 12.33, h: 0.35,
    fontSize: 9, fontFace: "Arial", color: SLATE, align: "center",
  });

  return slide;
}

// ===================== SLIDE 1: TITULLI =====================
const s1 = pptx.addSlide();
s1.background = { fill: BG };
// Decorative shapes
s1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: BLUE },
});
s1.addShape(pptx.ShapeType.rect, {
  x: 0, y: 7.44, w: 13.33, h: 0.06, fill: { color: BLUE },
});
s1.addShape(pptx.ShapeType.roundRect, {
  x: 1.2, y: 1, w: 10.93, h: 5.5, fill: { color: CARD },
  line: { color: BORDER, width: 1.5 }, rectRadius: 14,
});
s1.addShape(pptx.ShapeType.roundRect, {
  x: 1.2, y: 1, w: 10.93, h: 0.12, fill: { color: BLUE }, rectRadius: 0,
});
s1.addText("DATA BACKUP & RESTORE PORTAL", {
  x: 2, y: 1.8, w: 9.33, h: 1.2,
  fontSize: 38, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s1.addText("Platformë Web për Backup Automatik të SQL Server në Azure Cloud", {
  x: 2, y: 3, w: 9.33, h: 0.8,
  fontSize: 18, fontFace: "Arial", color: BLUE_LIGHT, align: "center",
});
s1.addShape(pptx.ShapeType.rect, {
  x: 5.5, y: 3.9, w: 2.33, h: 0.04, fill: { color: BLUE_LIGHT },
});
s1.addText("Lënda: Cloud Computing & MCC\nTema 25 — Menaxhimi i Backup-eve në Cloud", {
  x: 2, y: 4.2, w: 9.33, h: 1,
  fontSize: 15, fontFace: "Arial", color: GRAY, align: "center", lineSpacingMultiple: 1.6,
});
s1.addText("Visar", {
  x: 2, y: 5.5, w: 9.33, h: 0.5,
  fontSize: 14, fontFace: "Arial", color: SLATE, align: "center",
});

// ===================== SLIDE 2: QELLIMI =====================
addSlide("Qëllimi i Projektit", [
  { type: "list", text:
    "Krijimi i një platforme web që automatizon backup-in e databazave SQL Server\n\n" +
    "Sistemi garanton që të dhënat janë të SIGURTA, të AKSESUESHME dhe të RIKUPERUESHME\n\n" +
    "në rast dështimi të serverit lokal\n\n" +
    "Backup-et ruhen në Azure Cloud — jo në serverin lokal (Stateless Design)\n\n" +
    "Demo live: Me një klikim, e gjithë databaza ruhet në Cloud" },
]);

// ===================== SLIDE 3: TEKNOLOGJITE =====================
const s3 = pptx.addSlide();
s3.background = { fill: BG };
s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: 7.5, fill: { color: BLUE } });
s3.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.04, fill: { color: BLUE } });
s3.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 0.3, w: 12.33, h: 0.9, fill: { color: CARD }, line: { color: BORDER }, rectRadius: 6 });
s3.addText("Teknologjitë e Përdorura", { x: 0.8, y: 0.35, w: 11.5, h: 0.8, fontSize: 26, fontFace: "Arial", color: WHITE, bold: true });

const techs = [
  { title: "Frontend  —  React.js", desc: "Ndërfaqja vizuale, dashboard-i, tabelat, butonat, statuset me ngjyra", x: 0.5, color: "3B82F6" },
  { title: "Backend  —  Node.js + Express", desc: "Serveri API, ekzekutimi i komandave BACKUP/RESTORE, Azure upload", x: 6.8, color: "22C55E" },
  { title: "Database  —  SQL Server 2022", desc: "Burimi i të dhënave që backup-ohet (MyCompanyDB, BiznesDB, etj.)", x: 0.5, color: "EF4444" },
  { title: "Cloud  —  Azure Blob Storage", desc: "Ruajtja e sigurt e skedarëve .bak në Cloud me enkriptim at-rest", x: 6.8, color: "3B82F6" },
];
techs.forEach((t, i) => {
  const y = 1.6 + i * 1.45;
  s3.addShape(pptx.ShapeType.roundRect, { x: t.x, y, w: 5.8, h: 1.2, fill: { color: CARD }, line: { color: BORDER, width: 0.8 }, rectRadius: 8 });
  s3.addShape(pptx.ShapeType.roundRect, { x: t.x, y, w: 0.06, h: 1.2, fill: { color: t.color }, rectRadius: 0 });
  s3.addText(t.title, { x: t.x + 0.35, y: y + 0.1, w: 5.2, h: 0.4, fontSize: 15, fontFace: "Arial", color: WHITE, bold: true });
  s3.addText(t.desc, { x: t.x + 0.35, y: y + 0.5, w: 5.2, h: 0.5, fontSize: 12, fontFace: "Arial", color: GRAY });
});
s3.addText("Data Backup & Restore Portal — Cloud & MCC — Tema 25", { x: 0.5, y: 7.0, w: 12.33, h: 0.35, fontSize: 9, fontFace: "Arial", color: SLATE, align: "center" });

// ===================== SLIDE 4: ARKITEKTURA =====================
const s4 = pptx.addSlide();
s4.background = { fill: BG };
s4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 0.08, h: 7.5, fill: { color: BLUE } });
s4.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.04, fill: { color: BLUE } });
s4.addShape(pptx.ShapeType.roundRect, { x: 0.5, y: 0.3, w: 12.33, h: 0.9, fill: { color: CARD }, line: { color: BORDER }, rectRadius: 6 });
s4.addText("Arkitektura e Sistemit", { x: 0.8, y: 0.35, w: 11.5, h: 0.8, fontSize: 26, fontFace: "Arial", color: WHITE, bold: true });

const boxes = [
  { x: 1.2, y: 1.8, w: 3, h: 1.4, label: "Browser", sub: "React Dashboard\nlocalhost:5000", color: "3B82F6" },
  { x: 5.2, y: 1.8, w: 3, h: 1.4, label: "Node.js Backend", sub: "Express API\nPort 5000", color: "22C55E" },
  { x: 9.2, y: 1.8, w: 3, h: 1.4, label: "SQL Server", sub: "Database Engine\nPort 1433", color: "EF4444" },
  { x: 5.2, y: 4.2, w: 3, h: 1.4, label: "Azure Blob Storage", sub: "Cloud Storage\n.bak files", color: "3B82F6" },
];
boxes.forEach((b) => {
  s4.addShape(pptx.ShapeType.roundRect, { x: b.x, y: b.y, w: b.w, h: b.h, fill: { color: CARD }, line: { color: b.color, width: 1.5 }, rectRadius: 10 });
  s4.addText(b.label, { x: b.x, y: b.y + 0.2, w: b.w, h: 0.45, fontSize: 16, fontFace: "Arial", color: WHITE, bold: true, align: "center" });
  s4.addText(b.sub, { x: b.x, y: b.y + 0.7, w: b.w, h: 0.55, fontSize: 12, fontFace: "Arial", color: GRAY, align: "center" });
});
s4.addText("Kliko Create Backup", { x: 1.5, y: 3.4, w: 2.4, h: 0.5, fontSize: 11, fontFace: "Arial", color: GRAY, align: "center", italic: true });
s4.addText("BACKUP DATABASE", { x: 6.8, y: 3.4, w: 2.4, h: 0.5, fontSize: 11, fontFace: "Arial", color: GRAY, align: "center", italic: true });
s4.addText("Upload .bak", { x: 6.8, y: 4, w: 1.5, h: 0.5, fontSize: 11, fontFace: "Arial", color: GRAY, align: "center", italic: true });
s4.addText("Data Backup & Restore Portal — Cloud & MCC — Tema 25", { x: 0.5, y: 7.0, w: 12.33, h: 0.35, fontSize: 9, fontFace: "Arial", color: SLATE, align: "center" });

// ===================== SLIDE 5: WORKFLOW =====================
addSlide("Si Funksionon — Rrjedha e Punës", [
  { type: "list", text:
    "1. Përdoruesi klikon 'Create Backup' në dashboard\n\n" +
    "2. Backend-i (Node.js) lidhet me SQL Server dhe ekzekuton:\n       BACKUP DATABASE [EmriDB] TO DISK = N'...file.bak'\n\n" +
    "3. Skedari .bak gjenerohet dhe ruhet përkohësisht\n\n" +
    "4. Backend-i ngarkon skedarin në Azure Blob Storage\n\n" +
    "5. Skedari lokal FSHIhet — kursen hapësirë (Stateless Backend)\n\n" +
    "6. Detajet e backup-it regjistrohen në databazë" },
]);

// ===================== SLIDE 6: KRIJO BACKUP =====================
addSlide("Funksioni 1 — Krijo Backup", [
  { type: "list", text:
    "Kliko butonin 'Create Backup' për të gjeneruar një backup të plotë\n\n" +
    "Shkruaj emrin e databazës (ose lër bosh për vlerën default)\n\n" +
    "Backend-i ekzekuton: BACKUP DATABASE WITH COMPRESSION\n\n" +
    "Spinner-i tregon progresin gjatë backup-it\n\n" +
    "Rezultati: Status 'Success' (jeshil) ose 'Failed' (kuq)" },
]);

// ===================== SLIDE 7: AZURE =====================
addSlide("Funksioni 2 — Sinkronizimi me Azure Cloud", [
  { type: "list", text:
    "Pasi skedari .bak është gati, ngarkohet AUTOMATIKISHT në Azure\n\n" +
    "Azure Blob Storage ruan skedarët me enkriptim (at-rest encryption)\n\n" +
    "Pas ngarkimit, skedari lokal FSHIhet — kursen hapësirë në disk\n\n" +
    "Gjenerohet SAS Token (Secure Access Signature) për shkarkim\n\n" +
    "SAS Token skadon pas 2 orësh — SIGURI E LARTË" },
]);

// ===================== SLIDE 8: DOWNLOAD & RESTORE =====================
addSlide("Funksioni 3 — Shkarko dhe Restauro", [
  { type: "list", text:
    "SHKARKO (Download):\n" +
    "  Kliko 'Download' — gjenerohet SAS URL e sigurt\n" +
    "  Hapet skedari .bak direkt nga Azure (ose lokal nëse s'ka Cloud)\n\n" +
    "RESTAURO (Restore):\n" +
    "  Kliko 'Restore' — simulon rikuperimin e të dhënave\n" +
    "  Backend-i shkarkon skedarin dhe ekzekuton:\n" +
    "    RESTORE DATABASE [TestDB] FROM DISK = N'file.bak'\n" +
    "  VERIFIKON që backup-i është valid dhe i pakorruptuar" },
]);

// ===================== SLIDE 9: DASHBOARD =====================
addSlide("Funksioni 4 — Dashboard dhe Monitorimi", [
  { type: "list", text:
    "Tabelë dinamike që tregon TË GJITHA backup-et e realizuara\n\n" +
    "Kolonat: Emri i skedarit, Databaza, Madhësia, Statusi, Data, Veprimet\n\n" +
    "Statuset me ngjyra:\n" +
    "  Success = JESHIL  |  Failed = KUQ  |  Pending = VERDHË\n\n" +
    "Veprimet: Download (link i sigurt), Restore (verifiko), Delete (fshij)\n\n" +
    "Lista rifreskohet vetë pas krijimit të një backup-i të ri" },
]);

// ===================== SLIDE 10: SIGURIA =====================
addSlide("Siguria — Security", [
  { type: "list", text:
    "1. ENVIRONMENT VARIABLES (.env)\n" +
    "   Të gjitha kredencialet ruhen në .env — kurrë në kod\n" +
    "   .env është në .gitignore — nuk publikohet në GitHub\n\n" +
    "2. AZURE ENCRYPTION\n" +
    "   Skedarët në Azure janë të enkriptuar (at-rest)\n" +
    "   Qasja kontrollohet përmes Access Keys private\n\n" +
    "3. SAS TOKENS\n" +
    "   Shkarkimet përdorin SAS tokens me afat skadimi (2 orë)\n" +
    "   Pa qasje publike — vetëm përdoruesi i autorizuar" },
]);

// ===================== SLIDE 11: ZEVENDESIMI I AZURE =====================
addSlide("Pa Azure — Si Funksionon Zëvendësimi", [
  { type: "list", text:
    "Nëse Azure NUK është konfiguruar, sistemi funksionon njësoj:\n\n" +
    "Backend-i ruan skedarin .bak në:\n" +
    "  backend/temp/ (dosje lokale në laptop)\n\n" +
    "Të GJITHA funksionet mbeten të njëjta:\n" +
    "  ✓ Create Backup — gjeneron .bak dhe e ruan në temp/\n" +
    "  ✓ Download — shkarkon skedarin nga temp/\n" +
    "  ✓ Restore — merr skedarin nga temp/ dhe restauron\n" +
    "  ✓ Delete — fshin skedarin nga temp/\n\n" +
    "Dallimi i vetëm:\n" +
    "  Me Azure → .bak shkon në Cloud + fshihet nga temp/\n" +
    "  Pa Azure  → .bak mbetet në temp/ për shkarkim lokal\n\n" +
    "Kjo quhet 'Stateless Design' — asnjë skedar nuk mbetet\n" +
    "në backend pasi përpunohet (nëse Cloud është aktiv)" },
]);

// ===================== SLIDE 12: DATABAZAT =====================
addSlide("Databazat dhe Tabelat", [
  { type: "list", text:
    "backup_history (në çdo databazë që backup-oni):\n" +
    "  Ruan historikun: file_name, database_name, file_size_mb,\n" +
    "  cloud_url, sas_url, status, error_message, created_at\n\n" +
    "MyCompanyDB — Tabela Employees:\n" +
    "  Id, Name, Position, Salary — të dhëna biznesi\n\n" +
    "BiznesDB — Tabela Kliente:\n" +
    "  Id, Emri, Email, Qyteti — të dhëna klientësh\n\n" +
    "Mund të krijoni ÇDO databazë dhe ta backup-oni nga portali" },
]);

// ===================== SLIDE 13: LIVE DEMO =====================
addSlide("Demo Live — Hapat", [
  { type: "list", text:
    "1. Hap browser → http://localhost:5000\n\n" +
    "2. Shkruaj emrin e databazës (p.sh. BiznesDB)\n\n" +
    "3. Kliko 'Create Backup' — vëzhgo spinner-in\n\n" +
    "4. Backup-i i ri shfaqet në listë me badge JESHIL 'Success'\n\n" +
    "5. Kliko 'Download' — hapet link i sigurt për shkarkim\n\n" +
    "6. Kliko 'Restore' — konfirmon restaurimin në DB testuese\n\n" +
    "7. Kliko 'Delete' — fshin backup-in nga lista dhe storage" },
]);

// ===================== SLIDE 14: STRUKTURA =====================
addSlide("Struktura e Projektit (File Tree)", [
  { type: "code", h: 4.5, text:
    "ArbenLilaProjekt/\n" +
    "├── backend/\n" +
    "│   ├── server.js           ← Serveri Express\n" +
    "│   ├── .env                ← Kredencialet (Azure, SQL)\n" +
    "│   ├── config/\n" +
    "│   │   ├── db.js           ← Lidhja me SQL Server\n" +
    "│   │   └── azure.js        ← Azure Blob Storage\n" +
    "│   ├── routes/backup.js    ← API Endpoints\n" +
    "│   ├── controllers/       ← Logjika e backup/restore\n" +
    "│   └── models/            ← Modelet e databazës\n" +
    "├── frontend/\n" +
    "│   └── src/\n" +
    "│       ├── App.js          ← Komponenti kryesor\n" +
    "│       ├── components/     ← UI: Navbar, Dashboard, List\n" +
    "│       ├── services/api.js ← Lidhja me backend\n" +
    "│       └── styles/         ← CSS (dark mode)\n" +
    "├── .gitignore              ← Fsheh .env nga GitHub\n" +
    "└── Data-Backup-Restore-Portal-Presentation.pptx"},
]);

// ===================== SLIDE 15: SI TA EKZEKUTOJM =====================
addSlide("Si ta Ekzekutojmë Projektin", [
  { type: "title-sm", text: "Kushtet paraprake:" },
  { type: "list", text:
    "Node.js i instaluar\n" +
    "SQL Server i instaluar dhe duke punuar (porta 1433 TCP/IP)\n" +
    "(Opsionale) Azure Storage Account" },
  { type: "title-sm", text: "Hapat:" },
  { type: "list", text:
    "1. Konfiguro backend/.env me kredencialet e tua\n" +
    "2. Hap terminalin e parë: cd backend → npm start\n" +
    "3. Hap terminalin e dytë: cd frontend → npm start\n" +
    "4. Hap browser: http://localhost:5000\n" +
    "5. Kliko 'Create Backup' — dhe funksionon!" },
]);

// ===================== SLIDE 16: PERFUNDIMI =====================
const s15 = pptx.addSlide();
s15.background = { fill: BG };
s15.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: BLUE } });
s15.addShape(pptx.ShapeType.rect, { x: 0, y: 7.44, w: 13.33, h: 0.06, fill: { color: BLUE } });
s15.addShape(pptx.ShapeType.roundRect, { x: 1.5, y: 1.2, w: 10.33, h: 5.1, fill: { color: CARD }, line: { color: BLUE, width: 2 }, rectRadius: 14 });
s15.addShape(pptx.ShapeType.roundRect, { x: 1.5, y: 1.2, w: 10.33, h: 0.1, fill: { color: BLUE }, rectRadius: 0 });
s15.addText("Faleminderit!", {
  x: 2, y: 2, w: 9.33, h: 1.2,
  fontSize: 42, fontFace: "Arial", color: WHITE, bold: true, align: "center",
});
s15.addText("Me një klikim, sigurojmë të gjithë databazën në Azure Cloud", {
  x: 2, y: 3.3, w: 9.33, h: 0.7,
  fontSize: 18, fontFace: "Arial", color: BLUE_LIGHT, align: "center",
});
s15.addShape(pptx.ShapeType.rect, { x: 5.5, y: 4.1, w: 2.33, h: 0.04, fill: { color: BLUE_LIGHT } });
s15.addText("Cloud Computing & Menaxhimi i Sistemeve të Shpërndara\nTema 25 — Data Backup and Restore Portal", {
  x: 2, y: 4.4, w: 9.33, h: 0.9,
  fontSize: 14, fontFace: "Arial", color: GRAY, align: "center", lineSpacingMultiple: 1.6,
});
s15.addText("Pyetje?", {
  x: 2, y: 5.5, w: 9.33, h: 0.6,
  fontSize: 22, fontFace: "Arial", color: BLUE_LIGHT, bold: true, align: "center",
});

// SAVE
const outPath = path.join(__dirname, "Data-Backup-Restore-Portal-Presentation.pptx");
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("Presentation saved to: " + outPath);
}).catch((err) => {
  console.error("Error:", err);
});
