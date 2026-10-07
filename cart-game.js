/**
 * Cart Code Race
 * The question stays on screen. Answer boxes on the track are the choices.
 * A blue AI kart races for the same boxes.
 */
(function () {
    const POOL = [
        {
            topic: "setup() — runs once",
            hint: "Processing calls this one time, before the animation loop starts.",
            answer: "setup",
            wrongs: ["draw", "size", "loop"],
            code: "void [[?]]() {\n  size(800, 600);\n  carX = width / 2;\n  carY = height - 100;\n}"
        },
        {
            topic: "draw() — every frame",
            hint: "Processing repeats this function to animate the sketch.",
            answer: "draw",
            wrongs: ["setup", "loop", "frame"],
            code: "void [[?]]() {\n  background(0);\n  rect(carX, carY, 50, 100);\n}"
        },
        {
            topic: "size() — the window",
            hint: "Sets the canvas width and height in pixels. It belongs in setup().",
            answer: "size",
            wrongs: ["width", "height", "frame"],
            code: "void setup() {\n  [[?]](800, 600);\n}"
        },
        {
            topic: "background() — clear the frame",
            hint: "Call it inside draw() so the track does not smear.",
            answer: "background",
            wrongs: ["fill", "stroke", "clear"],
            code: "void draw() {\n  [[?]](0);\n  fill(50);\n  rect((width - trackWidth) / 2, 0, trackWidth, height);\n}"
        },
        {
            topic: "fill() — interior colour",
            hint: "RGB. 255, 0, 0 paints the kart red.",
            answer: "fill",
            wrongs: ["stroke", "color", "tint"],
            code: "[[?]](255, 0, 0);\nrect(carX, carY, 50, 100);"
        },
        {
            topic: "rect() — the kart body",
            hint: "A rectangle: x, y, width, height.",
            answer: "rect",
            wrongs: ["ellipse", "square", "line"],
            code: "fill(255, 0, 0);\n[[?]](carX, carY, 50, 100);"
        },
        {
            topic: "ellipse() — a wheel",
            hint: "An oval: x, y, width, height.",
            answer: "ellipse",
            wrongs: ["circle", "rect", "arc"],
            code: "fill(30);\n[[?]](wheelX, wheelY, 16, 16);"
        },
        {
            topic: "triangle() — a trackside tree",
            hint: "Three points: the tip, then the two base corners.",
            answer: "triangle",
            wrongs: ["rect", "line", "vertex"],
            code: "fill(34, 139, 34);\n[[?]](treeX, treeY, treeX - 20, treeY + 60, treeX + 20, treeY + 60);"
        },
        {
            topic: "float — a decimal",
            hint: "The type for values like 2.5. Both blanks are the same word.",
            answer: "float",
            wrongs: ["int", "double", "number"],
            code: "[[?]] carX, carY;\n[[?]] speed = 2;"
        },
        {
            topic: "int — a whole number",
            hint: "Use this type when the value has no decimal point.",
            answer: "int",
            wrongs: ["float", "byte", "long"],
            code: "[[?]] trackWidth = 400;"
        },
        {
            topic: "boolean — true or false",
            hint: "A logical value. It is either true or false.",
            answer: "boolean",
            wrongs: ["bool", "int", "String"],
            code: "[[?]] onTrack = true;"
        },
        {
            topic: "width — canvas width",
            hint: "A system variable: how many pixels wide the window is.",
            answer: "width",
            wrongs: ["height", "size", "screen"],
            code: "carX = [[?]] / 2;"
        },
        {
            topic: "height — canvas height",
            hint: "A system variable: how many pixels tall the window is.",
            answer: "height",
            wrongs: ["width", "size", "bottom"],
            code: "carY = [[?]] - 100;"
        },
        {
            topic: "mouseX — horizontal mouse",
            hint: "The mouse cursor's x position, in pixels.",
            answer: "mouseX",
            wrongs: ["mouseY", "pmouseX", "x"],
            code: "carX = map([[?]], 0, width, roadLeft, roadRight);"
        },
        {
            topic: "mouseY — vertical mouse",
            hint: "The mouse cursor's y position, in pixels.",
            answer: "mouseY",
            wrongs: ["mouseX", "pmouseY", "y"],
            code: "float green = [[?]] / 2;"
        },
        {
            topic: "keyPressed — a key is held",
            hint: "True for as long as any key is held down.",
            answer: "keyPressed",
            wrongs: ["keyReleased", "keyDown", "pressed"],
            code: "if ([[?]]) {\n  speed += 0.05;\n} else {\n  speed -= 0.02;\n}"
        },
        {
            topic: "constrain() — stay in range",
            hint: "Clamps a value between a low and a high number.",
            answer: "constrain",
            wrongs: ["map", "limit", "clamp"],
            code: "speed = [[?]](speed, 2, 10);"
        },
        {
            topic: "map() — scale a number",
            hint: "Converts a value from one range into another range.",
            answer: "map",
            wrongs: ["constrain", "lerp", "scale"],
            code: "carX = [[?]](mouseX, 0, width, roadLeft, roadRight);"
        },
        {
            topic: "random() — a surprise number",
            hint: "Returns a random float. random(height) is from 0 up to height.",
            answer: "random",
            wrongs: ["noise", "chance", "rand"],
            code: "treeY[i] = [[?]](height);"
        },
        {
            topic: "if — a condition",
            hint: "Runs the block only when the test is true.",
            answer: "if",
            wrongs: ["for", "while", "when"],
            code: "[[?]] (carY < 0) {\n  carY = height - 100;\n}"
        },
        {
            topic: "else — the other path",
            hint: "Runs when the if test is false.",
            answer: "else",
            wrongs: ["elif", "otherwise", "not"],
            code: "if (mouseX < width / 3) {\n  background(0, 0, 255);\n} [[?]] {\n  background(255);\n}"
        },
        {
            topic: "for — repeat a count",
            hint: "Loops a set number of times. The trees use one.",
            answer: "for",
            wrongs: ["while", "loop", "each"],
            code: "[[?]] (int i = 0; i < numTrees; i++) {\n  treeY[i] += speed * 2;\n}"
        },
        {
            topic: "stroke() — the outline",
            hint: "Sets the colour of a shape's border.",
            answer: "stroke",
            wrongs: ["fill", "border", "line"],
            code: "[[?]](255, 0, 0);\nellipse(x, y, 40, 40);"
        },
        {
            topic: "noStroke() — no outline",
            hint: "Turns the border off so only the fill shows.",
            answer: "noStroke",
            wrongs: ["noFill", "stroke", "noLine"],
            code: "void setup() {\n  size(400, 400);\n  [[?]]();\n}"
        },
        {
            topic: "println() — console text",
            hint: "Prints a message to the Processing console, useful for debugging.",
            answer: "println",
            wrongs: ["print", "text", "log"],
            code: "[[?]](\"speed = \" + speed);"
        }
    ];
    const ROUND_SIZE = 6;
    const DIFFICULTIES = {
        easy: {
            label: "Easy",
            think: 9000,
            cruise: 0.62,
            boost: 2.1,
            aiSteer: 1.15,
            aiSkill: 0.22,
            jitter: 0.08,
            decoys: 1,
            round: 4,
            hint: true,
            aiWaits: true
        },
        normal: {
            label: "Normal",
            think: 6000,
            cruise: 0.85,
            boost: 2.6,
            aiSteer: 2.15,
            aiSkill: 0.5,
            jitter: 0.12,
            decoys: 2,
            round: 6,
            hint: true,
            aiWaits: true
        },
        hard: {
            label: "Hard",
            think: 2800,
            cruise: 1.35,
            boost: 3.1,
            aiSteer: 2.85,
            aiSkill: 0.78,
            jitter: 0.06,
            decoys: 2,
            round: 6,
            hint: true,
            aiWaits: false
        },
        extreme: {
            label: "Extreme",
            think: 0,
            cruise: 1.9,
            boost: 3.5,
            aiSteer: 3.45,
            aiSkill: 0.94,
            jitter: 0.04,
            decoys: 3,
            round: 8,
            hint: false,
            aiWaits: false
        }
    };
    let difficulty = "normal";
    let waveRules = DIFFICULTIES.normal;

    function rules() {
        return DIFFICULTIES[difficulty];
    }

    const canvas = document.getElementById("cart-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const readyEl = document.getElementById("cart-ready");
    const finishEl = document.getElementById("cart-finish");
    const finishTitleEl = document.getElementById("cart-finish-title");
    const finishTextEl = document.getElementById("cart-finish-text");
    const topicEl = document.getElementById("cart-topic");
    const codeEl = document.getElementById("cart-code");
    const hintBtn = document.getElementById("cart-hint-btn");
    const hintEl = document.getElementById("cart-hint");
    const feedbackEl = document.getElementById("cart-feedback");
    const youEl = document.getElementById("cart-you");
    const aiEl = document.getElementById("cart-ai");
    const pipsEl = document.getElementById("cart-pips");

    const keys = { left: false, right: false };
    const view = { w: 640, h: 400 };
    let deck = [];
    let aiSkill = 0.55;
    let results = [];
    let youScore = 0;
    let aiScore = 0;
    let mode = "ready";
    let active = false;
    let loopOn = false;
    let last = 0;
    let kartX = 320;
    let kartY = 300;
    let aiX = 360;
    let speed = 0;
    let scroll = 0;
    let steerTilt = 0;
    let aiTilt = 0;
    let boxes = [];
    let aiChoice = null;
    let cooldown = 0;
    let thinkUntil = 0;
    const HOLD_Y = 78;
    let boostUntil = 0;
    let aiBoostUntil = 0;
    let playerSpinUntil = 0;
    let aiSpinUntil = 0;
    let onRoad = true;
    let boosting = false;
    let aiBoosting = false;
    let feedbackUntil = 0;
    let placed = false;
    const trees = [];

    function dealRound() {
        const pace = rules();
        deck = shuffle(POOL).slice(0, Math.min(pace.round, POOL.length));
        aiSkill = Math.min(0.98, Math.max(0, pace.aiSkill + (Math.random() - 0.5) * pace.jitter * 2));
        pipsEl.textContent = "";
        deck.forEach(() => {
            const pip = document.createElement("span");
            pip.className = "w-2.5 h-2.5 rounded-sm bg-gray-200";
            pipsEl.appendChild(pip);
        });
    }

    function clamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    function shuffle(list) {
        const copy = list.slice();
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const swap = copy[i];
            copy[i] = copy[j];
            copy[j] = swap;
        }
        return copy;
    }

    function road() {
        const roadW = Math.min(view.w - 20, Math.max(220, view.w * 0.82));
        const left = (view.w - roadW) / 2;
        return { left, right: left + roadW, width: roadW };
    }

    function roundRect(g, x, y, w, h, r) {
        const radius = Math.min(r, w / 2, h / 2);
        g.beginPath();
        g.moveTo(x + radius, y);
        g.arcTo(x + w, y, x + w, y + h, radius);
        g.arcTo(x + w, y + h, x, y + h, radius);
        g.arcTo(x, y + h, x, y, radius);
        g.arcTo(x, y, x + w, y, radius);
        g.closePath();
    }

    function seedTrees() {
        trees.length = 0;
        for (let i = 0; i < 8; i++) {
            trees.push({
                side: i % 2 === 0 ? -1 : 1,
                y: Math.random() * view.h,
                slot: 0.35 + Math.random() * 0.3
            });
        }
    }

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = Math.max(280, rect.width || 640);
        const h = 400;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        view.w = w;
        view.h = h;
        kartY = h * 0.78;
        if (!placed) {
            const lane = road();
            kartX = lane.left + lane.width * 0.34;
            aiX = lane.left + lane.width * 0.66;
            placed = true;
            seedTrees();
        } else {
            kartX = clamp(kartX, 22, w - 22);
            aiX = clamp(aiX, 22, w - 22);
        }
    }

    function updateScores() {
        youEl.textContent = String(youScore);
        aiEl.textContent = String(aiScore);
        Array.from(pipsEl.children).forEach((pip, i) => {
            const owner = results[i];
            pip.className = owner === "you"
                ? "w-2.5 h-2.5 rounded-sm bg-red-600"
                : owner === "ai"
                    ? "w-2.5 h-2.5 rounded-sm bg-blue-600"
                    : "w-2.5 h-2.5 rounded-sm bg-gray-200";
        });
    }

    function renderCode(code) {
        codeEl.textContent = "";
        const parts = code.split("[[?]]");
        parts.forEach((part, index) => {
            codeEl.appendChild(document.createTextNode(part));
            if (index < parts.length - 1) {
                const mark = document.createElement("span");
                mark.className = "cart-blank";
                mark.textContent = "?";
                codeEl.appendChild(mark);
            }
        });
    }

    function showQuestion() {
        const question = deck[0];
        if (!question) return;
        topicEl.textContent = question.topic;
        renderCode(question.code);
        hintEl.textContent = "";
        hintEl.classList.add("hidden");
        hintBtn.classList.toggle("hidden", !rules().hint);
    }

    function setFeedback(text, kind) {
        feedbackEl.textContent = text;
        feedbackEl.className = kind === "good"
            ? "text-xs mt-2 min-h-[1rem] text-green-300"
            : kind === "bad"
                ? "text-xs mt-2 min-h-[1rem] text-red-300"
                : "text-xs mt-2 min-h-[1rem] text-gray-300";
        feedbackUntil = performance.now() + 1700;
    }

    function pickAiChoice() {
        const alive = boxes.filter((box) => box.alive);
        const correct = alive.find((box) => box.correct);
        const wrongs = alive.filter((box) => !box.correct);
        if (correct && Math.random() < aiSkill) aiChoice = correct;
        else if (wrongs.length) aiChoice = wrongs[Math.floor(Math.random() * wrongs.length)];
        else aiChoice = correct || null;
    }

    function spawnBoxes() {
        const question = deck[0];
        if (!question) return;
        waveRules = rules();
        const decoys = shuffle(question.wrongs).slice(0, waveRules.decoys);
        const labels = shuffle([question.answer, ...decoys]);
        const lane = road();
        const gap = 8;
        let widths = labels.map((label) => Math.max(54, label.length * 6.3 + 14));
        const raw = widths.reduce((sum, width) => sum + width, 0) + gap * (labels.length - 1);
        const maxTotal = lane.width - 12;
        if (raw > maxTotal) {
            const scale = (maxTotal - gap * (labels.length - 1)) / widths.reduce((sum, width) => sum + width, 0);
            widths = widths.map((width) => width * scale);
        }
        const total = widths.reduce((sum, width) => sum + width, 0) + gap * (labels.length - 1);
        let cursor = lane.left + (lane.width - total) / 2;
        boxes = labels.map((label, index) => {
            const width = widths[index];
            const box = {
                x: cursor + width / 2,
                y: HOLD_Y,
                w: width,
                h: 32,
                label,
                correct: label === question.answer,
                alive: true
            };
            cursor += width + gap;
            return box;
        });
        pickAiChoice();
        thinkUntil = performance.now() + waveRules.think;
    }

    function award(who) {
        const question = deck[0];
        if (who === "you") {
            youScore += 1;
            results.push("you");
            boostUntil = performance.now() + 1500;
            setFeedback("Boost. That line is in the sketch.", "good");
        } else {
            aiScore += 1;
            results.push("ai");
            aiBoostUntil = performance.now() + 1500;
            setFeedback(`AI took ${question ? question.answer : "the line"}.`, "bad");
        }
        updateScores();
        deck.shift();
        boxes = [];
        aiChoice = null;
        cooldown = 720;
        if (!deck.length) {
            mode = "finish";
            const title = youScore > aiScore ? "You beat the AI" : youScore < aiScore ? "AI finished ahead" : "Draw";
            finishTitleEl.textContent = title;
            finishTextEl.textContent = `${rules().label}. You ${youScore} · AI ${aiScore}. Every blank came from the cart sketch.`;
            finishEl.classList.add("is-open");
            return;
        }
        showQuestion();
    }

    function spinKart(who) {
        const now = performance.now();
        if (who === "you") {
            playerSpinUntil = now + 760;
            speed = Math.min(speed, 2);
            setFeedback("Spin-out. That box is the wrong line.", "bad");
        } else {
            aiSpinUntil = now + 760;
            aiChoice = null;
        }
    }

    function overlapping(x, box) {
        return box.alive
            && Math.abs(x - box.x) < box.w / 2 + 12
            && Math.abs(kartY - box.y) < box.h / 2 + 22;
    }

    function resolveBoxes(now) {
        const hits = [];
        boxes.forEach((box) => {
            if (!box.alive) return;
            if (now >= playerSpinUntil && overlapping(kartX, box)) {
                hits.push({ who: "you", box, dist: Math.abs(kartX - box.x) });
            }
            if (now >= aiSpinUntil && overlapping(aiX, box)) {
                hits.push({ who: "ai", box, dist: Math.abs(aiX - box.x) });
            }
        });
        const correctHits = hits.filter((hit) => hit.box.correct);
        if (correctHits.length) {
            correctHits.sort((a, b) => a.dist - b.dist || (a.who === "you" ? -1 : 1));
            award(correctHits[0].who);
            return;
        }
        const seen = new Set();
        hits.forEach((hit) => {
            if (seen.has(hit.box)) return;
            seen.add(hit.box);
            hit.box.alive = false;
            spinKart(hit.who);
        });
        if (aiChoice && !aiChoice.alive) aiChoice = null;
    }

    function update(dt, now) {
        let scrollSpeed = 0;
        boosting = now < boostUntil;
        aiBoosting = now < aiBoostUntil;
        if (feedbackUntil && now > feedbackUntil) {
            feedbackEl.textContent = "";
            feedbackUntil = 0;
        }

        if (mode === "ready") {
            scrollSpeed = 0.55;
        } else if (mode === "finish") {
            scrollSpeed = 1.8;
        } else if (mode === "race") {
            const lane = road();
            onRoad = kartX > lane.left + 14 && kartX < lane.right - 14;
            const youSpin = now < playerSpinUntil;
            const aiSpin = now < aiSpinUntil;
            if (youSpin) {
                speed = Math.max(1.3, speed - 0.16 * dt);
                steerTilt = Math.sin(now / 38) * 1.1;
            } else {
                const thinking = boxes.length > 0 && now < thinkUntil;
                const target = thinking ? 0.4 : (!onRoad ? waveRules.cruise * 0.75 : boosting ? waveRules.boost : waveRules.cruise);
                speed += (target - speed) * 0.1 * dt;
                const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
                kartX += dir * (3.1 + speed * 0.12) * dt;
                steerTilt = dir * 0.24;
            }
            kartX = clamp(kartX, 18, view.w - 18);

            if (aiSpin) {
                aiTilt = Math.sin(now / 42) * 1.05;
            } else if (aiChoice && aiChoice.alive && (!waveRules.aiWaits || now >= thinkUntil)) {
                const delta = aiChoice.x - aiX;
                const dir = Math.abs(delta) < 5 ? 0 : Math.sign(delta);
                const aiSpeed = aiBoosting ? waveRules.aiSteer + 0.6 : waveRules.aiSteer;
                aiX += dir * aiSpeed * dt;
                aiTilt = dir * 0.22;
            } else {
                aiTilt *= 0.85;
            }
            aiX = clamp(aiX, lane.left + 8, lane.right - 8);
            scrollSpeed = speed;
        }

        scroll += scrollSpeed * dt;
        trees.forEach((tree) => {
            tree.y += scrollSpeed * dt;
            if (tree.y > view.h + 50) tree.y = -40 - Math.random() * 30;
        });

        if (mode === "race") {
            if (cooldown > 0) cooldown -= dt * 16.67;
            if (!boxes.length && cooldown <= 0 && deck.length) spawnBoxes();
            if (boxes.length) {
                const thinking = now < thinkUntil;
                boxes.forEach((box) => {
                    if (!thinking) box.y += scrollSpeed * dt;
                });
                if (!thinking) resolveBoxes(now);
                const correct = boxes.find((box) => box.correct);
                if (correct && correct.y > view.h + 28) {
                    boxes = [];
                    aiChoice = null;
                    cooldown = 420;
                }
            }
        }
    }

    function drawTree(x, y) {
        ctx.fillStyle = "#6b4423";
        ctx.fillRect(x - 3, y, 6, 14);
        ctx.fillStyle = "#1f7a3a";
        ctx.beginPath();
        ctx.moveTo(x, y - 26);
        ctx.lineTo(x - 14, y + 2);
        ctx.lineTo(x + 14, y + 2);
        ctx.fill();
    }

    function drawAnswerBox(box, now) {
        if (!box.alive) return;
        const bob = Math.sin((now + box.x) / 200) * 3;
        const left = -box.w / 2;
        const top = -box.h / 2;
        ctx.save();
        ctx.translate(box.x, box.y + bob);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.ellipse(0, box.h / 2 + 8, box.w * 0.32, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#C5A059";
        roundRect(ctx, left, top, box.w, box.h, 5);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#1a1a1a";
        ctx.stroke();
        let size = 12;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#1a1a1a";
        do {
            ctx.font = `bold ${size}px Consolas, "Courier New", monospace`;
            size -= 1;
        } while (size > 7 && ctx.measureText(box.label).width > box.w - 8);
        ctx.fillText(box.label, 0, 1);
        ctx.restore();
    }

    function drawKart(x, y, tilt, body, nose, glass, stripe, isBoosting, tag, now) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(tilt);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(0, 22, 18, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        if (isBoosting) {
            ctx.fillStyle = "#C5A059";
            ctx.beginPath();
            ctx.moveTo(-6, 26);
            ctx.lineTo(0, 26 + 10 + Math.sin(now / 40) * 6);
            ctx.lineTo(6, 26);
            ctx.fill();
        }
        ctx.fillStyle = "#161616";
        [[-16, -16], [16, -16], [-16, 16], [16, 16]].forEach(([wx, wy]) => {
            ctx.fillRect(wx - 5, wy - 7, 10, 14);
        });
        ctx.fillStyle = body;
        roundRect(ctx, -13, -24, 26, 48, 7);
        ctx.fill();
        ctx.fillStyle = nose;
        roundRect(ctx, -9, -26, 18, 12, 5);
        ctx.fill();
        ctx.fillStyle = glass;
        roundRect(ctx, -7, -6, 14, 12, 3);
        ctx.fill();
        ctx.fillStyle = stripe;
        ctx.fillRect(-2.5, -16, 5, 34);
        ctx.restore();

        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        roundRect(ctx, x - 14, y - 46, 28, 14, 3);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px Helvetica, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tag, x, y - 39);
        ctx.restore();
    }

    function draw(now) {
        const w = view.w;
        const h = view.h;
        const lane = road();

        ctx.fillStyle = "#143024";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#1b4332";
        const band = 34;
        const grassOff = scroll % (band * 2);
        for (let y = -band * 2; y < h + band; y += band * 2) {
            ctx.fillRect(0, y + grassOff, lane.left, band);
            ctx.fillRect(lane.right, y + grassOff, w - lane.right, band);
        }

        ctx.fillStyle = "#242424";
        ctx.fillRect(lane.left, 0, lane.width, h);
        ctx.fillStyle = "#f4f4f4";
        ctx.fillRect(lane.left + 4, 0, 3, h);
        ctx.fillRect(lane.right - 7, 0, 3, h);

        ctx.fillStyle = "#C5A059";
        const period = 46;
        const dashOff = scroll % period;
        for (let y = -period + dashOff; y < h; y += period) {
            ctx.fillRect(w / 2 - 2, y, 4, 18);
        }

        trees.forEach((tree) => {
            const x = tree.side < 0
                ? Math.max(8, lane.left * tree.slot)
                : lane.right + Math.max(8, (w - lane.right) * tree.slot);
            drawTree(x, tree.y);
        });

        if (mode === "race") boxes.forEach((box) => drawAnswerBox(box, now));

        drawKart(aiX, kartY - 36, aiTilt, aiBoosting ? "#60a5fa" : "#2563eb", "#93c5fd", "#dbeafe", "#C5A059", aiBoosting, "AI", now);
        drawKart(kartX, kartY, steerTilt, boosting ? "#ff3b30" : "#d90429", "#ff6b6b", "#b8e0ff", "#C5A059", boosting, "YOU", now);

        if (mode === "race" && boxes.length && now < thinkUntil) {
            ctx.fillStyle = "rgba(0,0,0,0.55)";
            roundRect(ctx, w / 2 - 78, h - 36, 156, 22, 4);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px Helvetica, Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("LINE UP YOUR ANSWER", w / 2, h - 25);
        }

        if (mode === "race" && !onRoad) {
            ctx.fillStyle = "rgba(0,0,0,0.6)";
            roundRect(ctx, w / 2 - 62, 12, 124, 26, 4);
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "bold 11px Helvetica, Arial, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("OFF THE TRACK", w / 2, 25);
        }
    }

    function tick(now) {
        if (!loopOn) return;
        const dt = Math.min(2.4, (now - last) / 16.67) || 1;
        last = now;
        if (active) {
            update(dt, now);
            draw(now);
            requestAnimationFrame(tick);
        } else {
            loopOn = false;
        }
    }

    function startLoop() {
        if (loopOn) return;
        loopOn = true;
        last = performance.now();
        requestAnimationFrame(tick);
    }

    function beginRace() {
        readyEl.classList.remove("is-open");
        finishEl.classList.remove("is-open");
        dealRound();
        results = [];
        youScore = 0;
        aiScore = 0;
        updateScores();
        boxes = [];
        aiChoice = null;
        waveRules = rules();
        speed = waveRules.cruise;
        boostUntil = 0;
        aiBoostUntil = 0;
        playerSpinUntil = 0;
        aiSpinUntil = 0;
        steerTilt = 0;
        aiTilt = 0;
        cooldown = 480;
        feedbackEl.textContent = "";
        const lane = road();
        const youSide = Math.random() > 0.5 ? 0.32 : 0.68;
        kartX = lane.left + lane.width * youSide;
        aiX = lane.left + lane.width * (youSide === 0.32 ? 0.68 : 0.32);
        showQuestion();
        mode = "race";
    }

    function hold(button, key) {
        if (!button) return;
        const down = (event) => {
            event.preventDefault();
            if (mode === "race") keys[key] = true;
        };
        const up = () => {
            keys[key] = false;
        };
        button.addEventListener("pointerdown", down);
        button.addEventListener("pointerup", up);
        button.addEventListener("pointerleave", up);
        button.addEventListener("pointercancel", up);
    }

    function paintDifficulty() {
        document.querySelectorAll("#cart-modes .cart-mode").forEach((button) => {
            button.classList.toggle("is-selected", button.dataset.difficulty === difficulty);
        });
        hintBtn.classList.toggle("hidden", !rules().hint);
        if (!rules().hint) hintEl.classList.add("hidden");
    }

    document.getElementById("cart-modes").addEventListener("click", (event) => {
        const button = event.target.closest("[data-difficulty]");
        if (!button || !DIFFICULTIES[button.dataset.difficulty]) return;
        difficulty = button.dataset.difficulty;
        paintDifficulty();
        if (mode !== "race") {
            dealRound();
            results = [];
            youScore = 0;
            aiScore = 0;
            updateScores();
            showQuestion();
        }
    });

    document.getElementById("cart-start").addEventListener("click", beginRace);
    document.getElementById("cart-replay").addEventListener("click", beginRace);
    hintBtn.addEventListener("click", () => {
        const question = deck[0];
        if (!question || !rules().hint) return;
        hintEl.textContent = question.hint;
        hintEl.classList.remove("hidden");
    });
    hold(document.getElementById("cart-left"), "left");
    hold(document.getElementById("cart-right"), "right");

    window.addEventListener("keydown", (event) => {
        if (!active || mode !== "race") return;
        if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
            keys.left = true;
            event.preventDefault();
        } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
            keys.right = true;
            event.preventDefault();
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") keys.left = false;
        if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") keys.right = false;
    });
    window.addEventListener("resize", () => {
        if (active) resize();
    });

    dealRound();
    showQuestion();
    updateScores();
    paintDifficulty();

    window.CartRace = {
        setActive(on) {
            active = on;
            if (!on) {
                keys.left = false;
                keys.right = false;
                return;
            }
            resize();
            startLoop();
        }
    };

    if (document.getElementById("resources")?.classList.contains("active")) {
        window.CartRace.setActive(true);
    }
})();
