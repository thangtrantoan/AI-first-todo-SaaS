// TodoSaaS — Generate Frames
// Figma Plugin: tạo 4 screens × 2 modes (Light + Dark)

var FONT_FAMILY = 'Inter';
var STYLE_MAP = { Regular: 'Regular', Medium: 'Medium', SemiBold: 'SemiBold', Bold: 'Bold' };
var FONTS_LOADED = false;

async function loadFonts() {
  var families = ['Inter', 'Roboto', 'Ubuntu', 'DejaVu Sans', 'Liberation Sans', 'Open Sans', 'Noto Sans', 'Arial', 'Helvetica Neue'];
  for (var fi = 0; fi < families.length; fi++) {
    var fam = families[fi];
    try {
      await figma.loadFontAsync({ family: fam, style: 'Regular' });
      FONT_FAMILY = fam;
      FONTS_LOADED = true;

      try { await figma.loadFontAsync({ family: fam, style: 'Medium' }); }
      catch (e) { STYLE_MAP.Medium = 'Regular'; }

      var sbLoaded = false;
      var sbCandidates = ['SemiBold', 'Semi Bold', 'Bold'];
      for (var si = 0; si < sbCandidates.length; si++) {
        try { await figma.loadFontAsync({ family: fam, style: sbCandidates[si] }); STYLE_MAP.SemiBold = sbCandidates[si]; sbLoaded = true; break; }
        catch (e) {}
      }
      if (!sbLoaded) STYLE_MAP.SemiBold = 'Regular';

      try { await figma.loadFontAsync({ family: fam, style: 'Bold' }); }
      catch (e) { STYLE_MAP.Bold = STYLE_MAP.SemiBold; }

      return;
    } catch (e) {}
  }
  // No font loaded — plugin will use rectangle placeholders for text
}

const C = {
  brand600: { r: 0.310, g: 0.271, b: 0.898 },
  white:    { r: 1.000, g: 1.000, b: 1.000 },
  gray50:   { r: 0.980, g: 0.980, b: 0.984 },
  gray100:  { r: 0.961, g: 0.961, b: 0.965 },
  gray200:  { r: 0.898, g: 0.902, b: 0.910 },
  gray400:  { r: 0.608, g: 0.620, b: 0.643 },
  gray500:  { r: 0.459, g: 0.471, b: 0.494 },
  gray600:  { r: 0.349, g: 0.361, b: 0.380 },
  gray700:  { r: 0.216, g: 0.224, b: 0.243 },
  gray800:  { r: 0.118, g: 0.125, b: 0.137 },
  gray900:  { r: 0.067, g: 0.071, b: 0.082 },
};

function theme(isDark) {
  return {
    bg:        isDark ? C.gray900 : C.gray50,
    card:      isDark ? C.gray800 : C.white,
    border:    isDark ? C.gray700 : C.gray200,
    text:      isDark ? C.gray50  : C.gray900,
    textSub:   isDark ? C.gray400 : C.gray500,
    textMuted: isDark ? C.gray500 : C.gray400,
    inputBg:   isDark ? C.gray700 : C.gray50,
    tabBg:     isDark ? C.gray700 : C.gray100,
  };
}

function solid(color) {
  return [{ type: 'SOLID', color }];
}

function rect(parent, x, y, w, h, color, opts) {
  opts = opts || {};
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  r.fills = solid(color);
  r.cornerRadius = opts.radius || 0;
  if (opts.border) {
    r.strokes = solid(opts.border);
    r.strokeWeight = opts.borderWidth || 1;
    r.strokeAlign = 'INSIDE';
  }
  parent.appendChild(r);
  return r;
}

function text(parent, str, x, y, opts) {
  opts = opts || {};
  if (FONTS_LOADED) {
    const t = figma.createText();
    t.fontName = { family: FONT_FAMILY, style: STYLE_MAP[opts.weight] || STYLE_MAP.Regular };
    t.characters = str;
    t.fontSize = opts.size || 14;
    t.fills = solid(opts.color || C.gray900);
    t.x = x; t.y = y;
    if (opts.width) {
      t.textAutoResize = 'HEIGHT';
      t.resize(opts.width, 20);
      if (opts.align) t.textAlignHorizontal = opts.align;
    }
    parent.appendChild(t);
    return t;
  } else {
    // Wireframe placeholder: rounded rectangle representing text
    const fs = opts.size || 14;
    const h = Math.round(fs * 1.2);
    const w = opts.width || Math.min(Math.round(str.length * fs * 0.52), 320);
    const r = figma.createRectangle();
    r.x = x; r.y = y;
    r.resize(Math.max(w, 16), h);
    r.fills = solid(opts.color || C.gray900);
    r.cornerRadius = Math.round(h / 3);
    r.opacity = 0.3;
    parent.appendChild(r);
    return r;
  }
}

function input(parent, label, placeholder, x, y, w, isDark) {
  const t = theme(isDark);
  text(parent, label, x, y, { size: 13, weight: 'Medium', color: t.text });
  rect(parent, x, y + 20, w, 44, t.card, { radius: 8, border: t.border });
  text(parent, placeholder, x + 12, y + 32, { color: t.textMuted });
  return y + 20 + 44;
}

function button(parent, label, x, y, w, variant, isDark) {
  const t = theme(isDark);
  const bg    = variant === 'primary' ? C.brand600 : t.tabBg;
  const color = variant === 'primary' ? C.white    : t.text;
  const border = variant === 'ghost' ? t.border : null;
  rect(parent, x, y, w, 44, bg, { radius: 8, border });
  text(parent, label, x, y + 14, { size: 14, weight: 'SemiBold', color, width: w, align: 'CENTER' });
  return y + 44;
}

function logo(parent, cx, y) {
  rect(parent, cx - 24, y, 48, 48, C.brand600, { radius: 12 });
  text(parent, '✓', cx - 9, y + 11, { size: 22, weight: 'Bold', color: C.white });
}

// ── LOGIN ──────────────────────────────────────────────────────────────
function buildLogin(frame, w, isDark) {
  const t = theme(isDark);
  const pad = 32, cw = w - pad * 2, cx = pad;
  rect(frame, cx, 32, cw, 656, t.card, { radius: 16, border: t.border });

  logo(frame, w / 2, 72);
  let y = 140;

  text(frame, 'Welcome back', cx + 24, y, { size: 24, weight: 'Bold', color: t.text, width: cw - 48, align: 'CENTER' });
  y += 36;
  text(frame, 'Sign in to your TodoSaaS account', cx + 24, y, { size: 14, color: t.textSub, width: cw - 48, align: 'CENTER' });
  y += 44;

  const iw = cw - 48, ix = cx + 24;
  y = input(frame, 'Email', 'you@example.com', ix, y, iw, isDark) + 16;
  y = input(frame, 'Password', '••••••••', ix, y, iw, isDark) + 8;

  text(frame, 'Forgot password?', ix, y, { size: 13, color: C.brand600, width: iw, align: 'RIGHT' });
  y += 32;

  button(frame, 'Sign in', ix, y, iw, 'primary', isDark);
  y += 60;
  text(frame, "Don't have an account?  Sign up", ix, y, { size: 13, color: t.textSub, width: iw, align: 'CENTER' });
}

// ── REGISTER ───────────────────────────────────────────────────────────
function buildRegister(frame, w, isDark) {
  const t = theme(isDark);
  const pad = 32, cw = w - pad * 2, cx = pad;
  rect(frame, cx, 32, cw, 836, t.card, { radius: 16, border: t.border });

  logo(frame, w / 2, 72);
  let y = 140;

  text(frame, 'Create account', cx + 24, y, { size: 24, weight: 'Bold', color: t.text, width: cw - 48, align: 'CENTER' });
  y += 36;
  text(frame, 'Start managing your tasks today', cx + 24, y, { size: 14, color: t.textSub, width: cw - 48, align: 'CENTER' });
  y += 44;

  const iw = cw - 48, ix = cx + 24;
  y = input(frame, 'Full name', 'John Doe', ix, y, iw, isDark) + 16;
  y = input(frame, 'Email', 'you@example.com', ix, y, iw, isDark) + 16;
  y = input(frame, 'Password', '••••••••', ix, y, iw, isDark) + 16;
  y = input(frame, 'Confirm password', '••••••••', ix, y, iw, isDark) + 24;

  button(frame, 'Create account', ix, y, iw, 'primary', isDark);
  y += 60;
  text(frame, 'Already have an account?  Sign in', ix, y, { size: 13, color: t.textSub, width: iw, align: 'CENTER' });
}

// ── FORGOT PASSWORD ────────────────────────────────────────────────────
function buildForgotPassword(frame, w, isDark) {
  const t = theme(isDark);
  const pad = 32, cw = w - pad * 2, cx = pad;
  rect(frame, cx, 32, cw, 700, t.card, { radius: 16, border: t.border });

  let y = 64;
  rect(frame, cx + 24, y, cw - 48, 6, t.tabBg, { radius: 3 });
  rect(frame, cx + 24, y, (cw - 48) / 2, 6, C.brand600, { radius: 3 });
  y += 20;
  text(frame, 'Step 1 of 2 — Enter your email', cx + 24, y, { size: 12, color: t.textSub, width: cw - 48, align: 'CENTER' });
  y += 36;

  text(frame, 'Forgot password?', cx + 24, y, { size: 24, weight: 'Bold', color: t.text, width: cw - 48, align: 'CENTER' });
  y += 36;
  text(frame, "We'll send a 6-digit OTP to your email", cx + 24, y, { size: 14, color: t.textSub, width: cw - 48, align: 'CENTER' });
  y += 44;

  const iw = cw - 48, ix = cx + 24;
  y = input(frame, 'Email', 'you@example.com', ix, y, iw, isDark) + 24;
  button(frame, 'Send OTP', ix, y, iw, 'primary', isDark);
  y += 60;

  rect(frame, cx + 24, y, cw - 48, 1, t.border, {});
  y += 24;

  text(frame, 'Step 2 — Enter OTP + New Password', cx + 24, y, { size: 13, weight: 'Medium', color: t.textMuted, width: cw - 48, align: 'CENTER' });
  y += 28;

  const boxSz = 44, gap = 8;
  const totalW = 6 * boxSz + 5 * gap;
  const bx = (w - totalW) / 2;
  for (let i = 0; i < 6; i++) {
    rect(frame, bx + i * (boxSz + gap), y, boxSz, boxSz, t.inputBg, { radius: 8, border: t.border });
    text(frame, '·', bx + i * (boxSz + gap) + 16, y + 10, { size: 22, weight: 'Bold', color: t.textMuted });
  }
  y += boxSz + 20;

  y = input(frame, 'New password', '••••••••', ix, y, iw, isDark) + 16;
  button(frame, 'Reset password', ix, y, iw, 'primary', isDark);
  y += 60;
  text(frame, '← Back to sign in', ix, y, { size: 13, color: C.brand600, width: iw, align: 'CENTER' });
}

// ── TODOS DASHBOARD ────────────────────────────────────────────────────
function buildDashboard(frame, w, h, isDark) {
  const t = theme(isDark);

  rect(frame, 0, 0, w, 64, t.card, { border: t.border });
  rect(frame, 20, 16, 32, 32, C.brand600, { radius: 8 });
  text(frame, '✓', 29, 25, { size: 16, weight: 'Bold', color: C.white });
  text(frame, 'TodoSaaS', 60, 22, { size: 18, weight: 'Bold', color: t.text });
  rect(frame, w - 56, 14, 36, 36, C.brand600, { radius: 18 });
  text(frame, 'J', w - 43, 23, { size: 15, weight: 'Bold', color: C.white });

  let y = 88;
  const cw = Math.min(680, w - 48);
  const cx = (w - cw) / 2;

  text(frame, 'My Todos', cx, y, { size: 28, weight: 'Bold', color: t.text });
  y += 48;

  rect(frame, cx, y, cw, 64, t.card, { radius: 12, border: t.border });
  rect(frame, cx + 12, y + 12, cw - 120, 40, t.inputBg, { radius: 8, border: t.border });
  text(frame, 'Add a new todo...', cx + 24, y + 24, { color: t.textMuted });
  rect(frame, cx + cw - 104, y + 12, 92, 40, C.brand600, { radius: 8 });
  text(frame, 'Add Todo', cx + cw - 104, y + 25, { size: 13, weight: 'SemiBold', color: C.white, width: 92, align: 'CENTER' });
  y += 80;

  text(frame, '3 remaining · 2 completed', cx, y, { size: 13, color: t.textSub });
  y += 32;

  const tabs = ['All', 'Active', 'Completed'];
  for (let i = 0; i < tabs.length; i++) {
    const active = i === 0;
    rect(frame, cx + i * 98, y, 88, 34, active ? C.brand600 : t.tabBg, { radius: 8 });
    text(frame, tabs[i], cx + i * 98, y + 10, { size: 13, weight: 'Medium', color: active ? C.white : t.textSub, width: 88, align: 'CENTER' });
  }
  y += 50;

  const todos = [
    { label: 'Design Figma mockups for all screens', done: false },
    { label: 'Set up FastAPI backend with auth',     done: true  },
    { label: 'Configure Railway deployment',          done: false },
    { label: 'Implement Zustand store for todos',    done: false },
    { label: 'Write API documentation',              done: true  },
  ];

  for (const todo of todos) {
    rect(frame, cx, y, cw, 56, t.card, { radius: 12, border: t.border });
    const cbBg = todo.done ? C.brand600 : t.inputBg;
    rect(frame, cx + 16, y + 18, 20, 20, cbBg, { radius: 4, border: todo.done ? C.brand600 : t.border });
    if (todo.done) text(frame, '✓', cx + 20, y + 21, { size: 11, weight: 'Bold', color: C.white });
    const labelColor = todo.done ? t.textMuted : t.text;
    text(frame, todo.label, cx + 48, y + 20, { color: labelColor });
    text(frame, '✕', cx + cw - 32, y + 20, { size: 13, color: t.textMuted });
    y += 64;
  }
}

// ── MAIN ───────────────────────────────────────────────────────────────
async function main() {
  await loadFonts();

  figma.currentPage.name = 'TodoSaaS Design';

  const screens = [
    { name: 'Login',          w: 448,  h: 768  },
    { name: 'Register',       w: 448,  h: 900  },
    { name: 'ForgotPassword', w: 448,  h: 768  },
    { name: 'TodosDashboard', w: 1024, h: 768  },
  ];

  let xOff = 0;

  for (const s of screens) {
    for (const isDark of [false, true]) {
      const frame = figma.createFrame();
      frame.name = isDark ? s.name + '_Dark' : s.name;
      frame.resize(s.w, s.h);
      frame.x = xOff;
      frame.y = isDark ? s.h + 80 : 0;
      frame.fills = solid(theme(isDark).bg);
      frame.clipsContent = true;
      figma.currentPage.appendChild(frame);

      switch (s.name) {
        case 'Login':          buildLogin(frame, s.w, isDark);            break;
        case 'Register':       buildRegister(frame, s.w, isDark);         break;
        case 'ForgotPassword': buildForgotPassword(frame, s.w, isDark);   break;
        case 'TodosDashboard': buildDashboard(frame, s.w, s.h, isDark);   break;
      }
    }
    xOff += s.w + 80;
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  const note = FONTS_LOADED ? '' : ' (wireframe mode — install Inter font for text)';
  figma.closePlugin('✅ 8 frames created' + note);
}

main().catch(function(err) {
  var msg = err instanceof Error ? err.message : (typeof err === 'string' ? err : JSON.stringify(err));
  figma.closePlugin('❌ ' + (msg || 'Unknown error'));
});
