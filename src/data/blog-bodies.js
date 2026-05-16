// Blog post bodies as raw HTML strings. Each is keyed by slug.
// We use HTML directly (not MDX) so the build stays one Astro page,
// keeps dependencies at zero, and renders the same way every time.
//
// Style rules:
//  - Use real <h2> / <h3> for crawl hierarchy.
//  - Keep paragraphs short (3-4 sentences). Mobile readability.
//  - Link out to /translate/, /practice/, /chart/, /morse-code/<x>/
//    where natural — internal-link density helps SEO + UX.
//  - Use <a class="k"> or <span class="k"> for inline Morse code.

export const bodies = {
  // ============================================================
  "how-to-learn-morse-code-in-30-days": `
<p>You can copy plain-text Morse at 20 WPM in 30 days. Not 90, not 6 months — 30. The catch is that you have to do it almost every day, follow a method designed to short-circuit the dot-and-dash counting habit, and stop trying to be perfect on day three.</p>

<p>This plan is built on the <strong>Koch method</strong>: learn at full target speed from day one, with only two characters at first, then add one new character per session as accuracy reaches 90%. The trainer at <a href="/practice/">/practice/</a> implements it directly.</p>

<h2>Before you start: the three rules</h2>
<ol>
  <li><strong>Sound, not sight.</strong> Don't read dots and dashes off a chart. Listen to the rhythm. Morse is an acoustic alphabet.</li>
  <li><strong>5 minutes a day beats 1 hour once a week.</strong> Daily repetition cements pattern recognition. Streaks are tracked on the practice page so you can see your own consistency.</li>
  <li><strong>Type what you hear.</strong> No looking up. If you don't know it, leave a blank and move on. Speed comes from confidence under uncertainty.</li>
</ol>

<h2>Days 1–3: K and M</h2>
<p>Open <a href="/practice/">/practice/</a> with the Koch trainer set to <span class="k">KM</span>. Speed: 18 WPM character, 12 WPM effective (Farnsworth). Play groups of five characters at random, type what you hear, hit Reveal at the end. Aim for 90% accuracy across 10 groups. If you hit it, add the next letter. If not, repeat tomorrow.</p>

<h2>Days 4–14: the first ten</h2>
<p>The Koch order is intentional — it spaces out look-alike rhythms. Add one character per day in this order: <span class="k">K M R S U A P T L O</span>. By day ten you should have all ten and be hitting 90% on mixed groups.</p>
<p>Per-letter pages help when you get stuck on a specific one: try <a href="/morse-code/k/">/morse-code/k/</a>, <a href="/morse-code/r/">/morse-code/r/</a>, etc. Each plays the letter on demand with the rhythm bar so you can see the sound shape.</p>

<h2>Days 15–22: vowels, punctuation, common letters</h2>
<p>Add <span class="k">W I . N J E F 0</span>. The period (<a href="/morse-code/punctuation/">.-.-.-</a>) and digit zero start appearing in real text now. You'll start <em>head-copying</em> short words automatically — that's the goal.</p>

<h2>Days 23–30: the rest of the alphabet</h2>
<p>Add the remaining characters in Koch order: <span class="k">Y V , G 5 / Q 9 Z H 3 8 B ? 4 2 7 C 1 D 6 X</span>. By the last week you're copying complete English sentences. Try the <a href="/translate/">translator</a> on a friend's text message and copy it from the audio.</p>

<h2>What to do after day 30</h2>
<ul>
  <li>Bump character speed to 20 WPM. Lower Farnsworth (effective) gradually as your ear catches up.</li>
  <li>Practice <a href="/phrases/">common phrases</a> — operators rely on stock patterns, not arbitrary words.</li>
  <li>Read about <a href="/q-codes/">Q-codes</a> and <a href="/abbreviations/">CW abbreviations</a>. CW conversations are 80% shorthand.</li>
  <li>If you want to send on real radio, find a local ham club — most run weekly CW practice nets.</li>
</ul>

<h2>Common mistakes that slow people down</h2>
<ul>
  <li><strong>Starting too slow.</strong> Anything under 15 WPM character speed teaches you to count. Always 18+ at character speed.</li>
  <li><strong>Looking at the chart while practicing.</strong> Cover it. Your eyes are not your ears.</li>
  <li><strong>Skipping days.</strong> Three skipped days resets you by a week.</li>
</ul>

<p>That's it. Open the trainer and start: <a class="k" href="/practice/">/practice/</a>.</p>
`,

  // ============================================================
  "why-morse-code-is-still-used-today": `
<p>Morse code stopped being the maritime distress standard in 1999. It's never coming back as a primary commercial mode. And yet — in 2026 it's still in active daily use across at least five different domains. Here's where it lives.</p>

<h2>1) Amateur radio (the biggest user)</h2>
<p>Hams call it <strong>CW</strong> (continuous wave). It survives in ham radio for one practical reason: <em>it gets through</em>. A 5-watt QRP transmitter using CW can cross an ocean from a portable antenna on a hill. The same 5 watts on SSB voice would be unintelligible.</p>
<p>CW occupies maybe 100 Hz of bandwidth versus 2,400 Hz for SSB voice. Less bandwidth = lower noise floor = more reach per watt. Operators use <a href="/q-codes/">Q-codes</a> and <a href="/abbreviations/">CW abbreviations</a> to keep messages dense.</p>

<h2>2) Aviation navaid identifiers</h2>
<p>Every VOR and NDB beacon transmits its three- or four-letter ID in Morse on a continuous loop. Pilots match the audio against the chart to verify they've tuned the right station. This is required training in every flight school in 2026, and aviation charts still show the ID in Morse next to the frequency.</p>
<p>Some examples you might hear on an approach: <span class="k">JFK = .--- ..-. -.-</span>, <span class="k">SFO = ... ..-. ---</span>.</p>

<h2>3) Military and special-forces backup comms</h2>
<p>Most special-operations units still teach Morse as a fallback for low-bandwidth, low-power, high-noise environments. It's also resilient to jamming — a trained operator can pull a CW signal out of noise that would defeat any digital mode.</p>

<h2>4) Emergency signalling</h2>
<p>SOS in light, sound, or even physical taps remains the most widely recognized distress pattern on earth. See our <a href="/blog/emergency-morse-code-cheat-sheet/">emergency Morse cheat sheet</a> for the short list anyone can memorize in an afternoon.</p>

<h2>5) Accessibility</h2>
<p>People with severe motor impairments use single-switch Morse input — a single button press becomes a dit or dah depending on hold time. This is the most natural keyboard for some users, and modern operating systems (iOS, Android, Windows) all ship Morse input methods.</p>

<h2>Where it's NOT used anymore</h2>
<ul>
  <li><strong>Maritime distress</strong> — replaced by GMDSS in 1999.</li>
  <li><strong>Telegraphy</strong> — landline telegraph networks were retired by the late 20th century.</li>
  <li><strong>Commercial radio operator licensing</strong> — most countries dropped the Morse requirement by 2003-2007.</li>
</ul>

<h2>Why it doesn't die</h2>
<p>Morse code is one of the only encoding systems that a human can both <em>generate and decode</em> entirely in their head, with no equipment more complex than a flashlight or a stick on a fence post. As long as that's a useful property — and it is, in any low-power, low-tech, or emergency scenario — Morse will stay alive.</p>

<p>Want to learn it? <a href="/blog/how-to-learn-morse-code-in-30-days/">Start with our 30-day plan</a> or open the <a href="/practice/">Koch trainer</a>.</p>
`,

  // ============================================================
  "morse-code-vs-binary": `
<p>People often describe Morse code as "the original binary," but the comparison is loose. Both encode information with two symbols, but the timing rules, alphabet size, error tolerance, and bandwidth are completely different. Here's a side-by-side that respects both.</p>

<h2>What they have in common</h2>
<ul>
  <li><strong>Two-symbol alphabet.</strong> Dot/dash, or 0/1.</li>
  <li><strong>Variable-length encoding.</strong> In Morse, common letters are short (E = single dit, T = single dah). Binary uses Huffman coding for the same reason.</li>
  <li><strong>Encodable by hand.</strong> A trained human can produce both with a key/keyboard.</li>
</ul>

<h2>Key differences</h2>

<h3>Timing matters in Morse</h3>
<p>Binary is a sequence of discrete bits. Morse is a stream where the <em>duration</em> of each signal carries meaning: a dot is 1 unit, a dash is 3, a letter gap is 3, a word gap is 7. Two adjacent dits and a single dah only differ in timing.</p>
<p>This is why <a href="/translate/">/translate/</a> talks about WPM (words per minute) and renders a rhythm bar that animates with the audio — the same letters at different speeds are still the same letters, but the listener has to track the tempo.</p>

<h3>Alphabet size</h3>
<p>Binary is 1-bit. Each symbol carries one bit of entropy. Morse symbols carry <em>roughly</em> 1 bit each but the alphabet (the set of dot-dash strings that map to a character) is large: 26 letters, 10 digits, ~20 punctuation, prosigns. To encode "A" in binary you need a chosen encoding like ASCII (8 bits). To encode "A" in Morse you need one dot, one dash (<span class="k">.-</span>).</p>

<h3>Error tolerance</h3>
<p>Binary has no inherent error correction. A single flipped bit changes the character. Morse, transmitted by ear, is highly redundant: humans can guess missed dots from rhythm context. CW operators routinely copy 80–90% accuracy under noise that would defeat raw binary at the same bandwidth.</p>

<h3>Bandwidth</h3>
<p>A 20 WPM Morse signal occupies about 100 Hz on the air. A 9600-baud binary modem occupies 2,000+ Hz. For low-power long-distance work, Morse delivers more meaning per hertz than almost anything else.</p>

<h3>Compatibility with computers</h3>
<p>Binary is the native language of digital systems. Morse is encoded for human ears — to make a computer "speak Morse" we have to translate to/from another encoding (usually ASCII or UTF-8). That's what tools like our <a href="/api/">/morse.json</a> map do.</p>

<h2>Summary table</h2>
<div class="tablewrap">
<table>
<thead><tr><th>Property</th><th>Morse</th><th>Binary</th></tr></thead>
<tbody>
<tr><td>Symbols</td><td>dit, dah (+ gaps)</td><td>0, 1</td></tr>
<tr><td>Timing-sensitive</td><td>Yes (relative durations)</td><td>No (clocked discretely)</td></tr>
<tr><td>Variable-length characters</td><td>Yes</td><td>Yes (in Huffman/UTF-8)</td></tr>
<tr><td>Human-decodable by ear</td><td>Yes</td><td>No</td></tr>
<tr><td>Native to computers</td><td>No</td><td>Yes</td></tr>
<tr><td>Bandwidth (per unit info)</td><td>Very low</td><td>Higher</td></tr>
<tr><td>Standard year</td><td>1865 → 1909 (ITU)</td><td>1948 (Shannon)</td></tr>
</tbody>
</table>
</div>

<p>So: Morse and binary aren't ancestors of each other. They're independent answers to the same question (how do you encode information with two symbols?), tuned for different transmission media — air-modulated sound versus electrical state.</p>
`,

  // ============================================================
  "the-story-behind-sos": `
<p>SOS doesn't stand for "Save Our Souls." It doesn't stand for "Save Our Ship," either. It doesn't stand for anything. It was chosen in 1906 for one reason: the rhythm <span class="k">... --- ...</span> is unmistakable.</p>

<h2>Before SOS</h2>
<p>Wireless telegraphy by Marconi gave ships at sea their first long-distance distress signal in the 1890s. Different fleets used different patterns:</p>
<ul>
  <li><strong>CQD</strong> — Marconi's preferred distress signal. "CQ" was a general "all stations" call; the "D" stood for "distress." Used by Marconi-equipped ships.</li>
  <li><strong>NC</strong> — international maritime distress code from the visual code book.</li>
  <li><strong>SOE</strong> — used by some German fleets.</li>
</ul>
<p>The problem was obvious: every operator and every ship would have to know which signal to listen for, in noisy radio conditions, in an emergency. The 1906 Berlin International Radiotelegraphic Conference fixed it.</p>

<h2>Why three dots, three dashes, three dots</h2>
<p>The committee wanted a signal that:</p>
<ol>
  <li>Was <strong>short</strong> — under 10 elements so it could be sent in seconds.</li>
  <li>Was <strong>distinct</strong> — no other letter or word combination in Morse had the same rhythm.</li>
  <li>Was <strong>symmetric</strong> — operators could recognize it regardless of how the wave faded in and out.</li>
  <li>Was <strong>easy to send under stress</strong> — alternating dots and dashes, no awkward Morse letters.</li>
</ol>
<p>The pattern <span class="k">... --- ...</span> nails all four. Sent as a single signal (no inter-letter gap), it's one continuous shape your ear locks onto. Sent with gaps, it spells "SOS." Both readings work.</p>

<h2>When it became official</h2>
<p>The Berlin convention was signed in November 1906. It became internationally effective on <strong>July 1, 1908</strong>. The first widely-publicized SOS transmission came from the SS Slavonia after running aground in 1909.</p>
<p>The most famous SOS in history was sent by the RMS Titanic on the night of April 14–15, 1912 — alongside the older CQD signal, since both were still in use.</p>

<h2>The retroactive meanings</h2>
<p>"Save Our Souls" and "Save Our Ship" are <em>backronyms</em> — meanings invented after the fact to make the letters memorable. They started appearing in popular press shortly after SOS was adopted. They're harmless, but they're not why the signal exists.</p>

<h2>The end of SOS as a maritime standard</h2>
<p>On February 1, 1999, the Global Maritime Distress and Safety System (GMDSS) replaced Morse for ocean distress. Ships now use satellite EPIRBs, DSC-equipped radios, and automatic position reporting. The last commercial U.S. Morse maritime transmission ended on July 12, 1999.</p>

<h2>SOS today</h2>
<p>Outside of maritime, SOS remains the most universally recognized distress pattern. It works with:</p>
<ul>
  <li><strong>A flashlight</strong> — three short, three long, three short flashes.</li>
  <li><strong>A whistle</strong> — same rhythm.</li>
  <li><strong>Banging on metal</strong> — pipes, hulls, anything.</li>
  <li><strong>Your phone's flashlight</strong> — every modern smartphone has an SOS mode that pulses this pattern.</li>
</ul>
<p>Try it now: open the <a href="/translate/?q=SOS">translator with SOS pre-filled</a>, hit Play, and listen to the rhythm. It's been the sound of "I need help" for over a century.</p>
`,

  // ============================================================
  "best-ways-to-practice-morse-code": `
<p>There are roughly twenty Morse code training methods on the internet. Most are some variation of three or four real techniques, ranked here from most-to-least effective for getting from zero to head-copy in a reasonable time.</p>

<h2>1) The Koch method (best, by a wide margin)</h2>
<p>Start at <strong>full target speed</strong> (e.g. 18 WPM) but with only two characters: K and M. Practice until you copy ≥ 90% of random groups. Add one new character. Repeat. The trainer at <a href="/practice/">/practice/</a> implements this.</p>
<p>Why it works: you train pattern recognition at the speed you'll actually need. Most learners who start slow (5-10 WPM) build a habit of counting dots and dashes, then have to unlearn it later. Koch skips the unlearning step.</p>

<h2>2) Farnsworth timing</h2>
<p>Use full character speed (18+ WPM), but artificially stretch the gaps between letters and words. The character is recognized as a sound shape; the slow gaps give your brain time to identify it. As accuracy improves you reduce the gap until it matches the character speed.</p>
<p>Farnsworth is built into the practice trainer as the "Effective speed" slider.</p>

<h2>3) Single-character drills (good for stubborn letters)</h2>
<p>If one letter trips you up — most commonly C, Q, Y, or the digits — open its per-letter page (e.g. <a href="/morse-code/c/">/morse-code/c/</a>) and play the audio repeatedly. The rhythm bar shows the sound shape so you can see what your ear should expect.</p>

<h2>4) Head copy at low WPM</h2>
<p>Once you can copy 15-20 WPM by hand-writing, switch to <em>head copy</em> — listen, identify, don't write. Start at 12 WPM and work up. Head copy is what you need for real radio conversations.</p>

<h2>5) Common-phrase memorization</h2>
<p>Operators rely on stock patterns: <span class="k">CQ</span>, <span class="k">DE</span>, <span class="k">73</span>, <span class="k">QRZ</span>, <span class="k">QSY</span>. Memorize the top 30-40 abbreviations and Q-codes — you'll catch them in real QSOs before you'd otherwise hear the letters. See our <a href="/abbreviations/">CW abbreviations</a> and <a href="/q-codes/">Q-codes</a> pages.</p>

<h2>6) On-air QSOs (the final exam)</h2>
<p>Find a club or use a slow-CW practice net (most regional ham radio groups run them weekly). Real on-air conversations have signal fade, interference, and different sending styles — none of which the trainer simulates. You'll find weaknesses you didn't know you had.</p>

<h2>7) Mnemonics (last resort)</h2>
<p>"For dah-dit-dit Dah-Dit-Dit dah-dah-dah" rhymes are sometimes taught to absolute beginners. They build the wrong muscle (verbal mapping instead of rhythmic recognition) and almost everyone using them hits a speed wall around 8-10 WPM. Use mnemonics only if you're memorizing for a one-time test, not for fluency.</p>

<h2>What doesn't work</h2>
<ul>
  <li>Reading printed Morse charts. Your eyes never learn rhythm.</li>
  <li>Mass-marathon practice sessions. 5 minutes a day > 1 hour a week.</li>
  <li>Trying to learn American Morse — it's a different code, no longer used. International Morse only.</li>
</ul>

<h2>The one-page action plan</h2>
<ol>
  <li>Open the <a href="/practice/">Koch trainer</a> at 18 WPM character, 12 WPM Farnsworth.</li>
  <li>Practice 5 minutes a day, daily. Set a phone alarm.</li>
  <li>Add one character when you copy 10 groups at ≥ 90%.</li>
  <li>After all characters, practice <a href="/phrases/">common phrases</a>.</li>
  <li>After 30 days, find a club, get on the air.</li>
</ol>
`,

  // ============================================================
  "morse-code-in-aviation": `
<p>Every VOR and NDB navaid in the world identifies itself in Morse code, on a continuous audio loop. As of 2026 this is still required pilot knowledge — student pilots learn it during instrument training, and every IFR chart shows the navaid's identifier in Morse next to its frequency.</p>

<h2>Why Morse, not voice?</h2>
<p>VOR and NDB transmitters are simple, unattended ground stations. They put out a tone modulated with the navaid's three- or four-letter ID in Morse, every few seconds. The advantages over a synthesized voice ID:</p>
<ul>
  <li><strong>Bandwidth-efficient</strong> — fits in a sub-carrier without disrupting the primary navigation signal.</li>
  <li><strong>Unambiguous</strong> — Morse audio is recognizable under noise that would garble speech.</li>
  <li><strong>Cheap to broadcast</strong> — VOR ID transmitters are simpler than voice synthesizers.</li>
  <li><strong>International</strong> — pilots from any country can decode it without speaking the local language.</li>
</ul>

<h2>What pilots actually do</h2>
<ol>
  <li>Tune the VOR/NDB frequency on the radio.</li>
  <li>Listen to the audio — there's a continuous tone with periodic Morse ID.</li>
  <li>Compare the heard ID against the chart (printed or on the EFB).</li>
  <li>If they match, the navaid is identified and the indicator is trustworthy.</li>
  <li>If they don't match (or if the ID is missing or replaced by a "T-E-S-T" pattern), the navaid is out of service.</li>
</ol>

<h2>Examples</h2>
<p>Common navaid identifiers you'd hear on a chart:</p>
<ul>
  <li><strong>JFK VOR</strong> — <span class="k">.--- ..-. -.-</span> (JFK)</li>
  <li><strong>SFO VOR</strong> — <span class="k">... ..-. ---</span> (SFO)</li>
  <li><strong>LAX VOR</strong> — <span class="k">.-.. .- -..-</span> (LAX)</li>
  <li><strong>BOS VOR</strong> — <span class="k">-... --- ...</span> (BOS)</li>
</ul>
<p>You can try any of these in the <a href="/translate/">translator</a> to hear what they sound like.</p>

<h2>What the patterns sound like in the cockpit</h2>
<p>VOR IDs are sent at about 7 WPM — much slower than amateur radio CW. The slow speed is intentional: pilots in busy cockpits should be able to identify the navaid without dedicated focus. Many ID's are sent in a "1020 Hz" sub-carrier that pilots can selectively mute, leaving only the nav signal.</p>

<h2>NDB (Non-Directional Beacon)</h2>
<p>NDBs are older than VORs and now mostly retired in the US (their service was phased out through the 2010s and 2020s). In countries with sparse VOR coverage they're still active. NDB identifiers are usually only two letters and the broadcast is the navaid's only identifier — there's no separate digital data stream.</p>

<h2>Charted vs heard</h2>
<p>FAA Sectional and IFR charts always print the navaid ID with Morse dots and dashes underneath the three-letter abbreviation. Pilots cross-reference visually first, then audibly. EFB apps (ForeFlight, Garmin Pilot, etc.) do the same.</p>

<h2>Will it stay?</h2>
<p>Probably. Even as GPS-based navigation replaces VORs, the FAA maintains a <em>Minimum Operational Network</em> of VORs across the US specifically as a backup for GPS outages. Those VORs keep their Morse IDs. So learning Morse remains, in a small but real way, a piece of aviation safety.</p>

<p>To listen to an aircraft-style identifier yourself, type a 3-letter callsign like <a href="/translate/?q=JFK">JFK</a> into our translator and hit Play.</p>
`,

  // ============================================================
  "emergency-morse-code-cheat-sheet": `
<p>Three signals to memorize. That's it. If you only ever learn three things in Morse code, learn these:</p>

<h2>The three you have to know</h2>
<div class="tablewrap">
<table>
<thead><tr><th>Signal</th><th>Morse</th><th>Meaning</th></tr></thead>
<tbody>
<tr><td><strong>SOS</strong></td><td class="k">... --- ...</td><td>Universal distress — "I need help, send rescue"</td></tr>
<tr><td><strong>MAYDAY</strong></td><td class="k">-- .- -.-- -.. .- -.--</td><td>Voice distress; in Morse, SOS is more common</td></tr>
<tr><td><strong>HELP</strong></td><td class="k">.... . .-.. .--.</td><td>General "help" message</td></tr>
</tbody>
</table>
</div>

<h2>How to send it without a radio</h2>

<h3>With a flashlight</h3>
<ol>
  <li>Short flash = dot (one count).</li>
  <li>Long flash = dash (three counts).</li>
  <li>Pause between signals = one count.</li>
  <li>Pause between letters = three counts.</li>
  <li>Pause between words = seven counts.</li>
</ol>
<p>For SOS: <strong>flash flash flash &nbsp;·&nbsp; long long long &nbsp;·&nbsp; flash flash flash</strong>. Pause for several seconds. Repeat.</p>
<p>Modern smartphones often have an SOS-flashlight built in (iOS: Control Center → Flashlight long-press; Android varies by device). It pulses this exact pattern.</p>

<h3>With a whistle</h3>
<p>Same rhythm. Three short blasts, three long blasts, three short blasts. The international mountaineering distress signal is also six blasts in a minute, repeating — but SOS rhythm is recognized worldwide.</p>

<h3>With sound (banging on pipes, hulls, etc.)</h3>
<p>Hit a hard object three times quickly, then three times slowly (longer pause between each), then three times quickly. Pause. Repeat. Travelers stuck in elevators, ships' hulls, mines, and avalanches have been rescued this way.</p>

<h3>Body or visual signs</h3>
<p>Carve the letters "SOS" into snow or sand — large, visible from the air. Aviation pilots scanning for survivors look for it. The letters by themselves don't require Morse knowledge to recognize.</p>

<h2>Useful phrases</h2>
<p>If you have the time and energy to send more, these are worth memorizing in dot/dash:</p>
<ul>
  <li><strong>I AM SAFE</strong> — <span class="k">.. / .- -- / ... .- ..-. .</span></li>
  <li><strong>NEED WATER</strong> — <span class="k">-. . . -.. / .-- .- - . .-.</span></li>
  <li><strong>NEED HELP</strong> — <span class="k">-. . . -.. / .... . .-.. .--.</span></li>
  <li><strong>WAIT HERE</strong> — <span class="k">.-- .- .. - / .... . .-. .</span></li>
</ul>
<p>You can preview any of these on the <a href="/translate/">translator</a> with audio playback.</p>

<h2>What NOT to do</h2>
<ul>
  <li>Don't keep transmitting once you've been acknowledged or you see help — let other channels work.</li>
  <li>Don't send false distress signals as a test. False alarms are punishable by law in most countries and divert rescue resources.</li>
  <li>Don't worry about being slow. A clearly-sent slow SOS gets through; a fast garbled one doesn't.</li>
</ul>

<h2>Print this</h2>
<p>The <a href="/chart/">printable Morse chart</a> is designed to print on one page in either light or dark mode. Stash a copy in your camping kit, glovebox, or first-aid bag. The whole International Morse Code is 36 letters and 10 digits — pre-printed is faster than memorized when you're under stress.</p>
`,

  "how-to-send-morse-code": `
<p>Most beginner Morse advice teaches you to <em>copy</em> — to decode what someone else is sending. That's the half that fits in an app. The other half — actually <strong>sending</strong> good Morse — is the half that determines whether anyone wants to talk to you on the air.</p>

<p>This guide covers sending. By the end you'll have picked a key, learned the rhythm before the letters, and have a concrete path to your first on-air contact at a slow-speed net.</p>

<h2>Pick a key that matches your stage</h2>

<p>The single most common beginner mistake is buying a fast key — a paddle or a bug — before they can send a clean letter. Each key type has a reason to exist:</p>

<table>
  <thead><tr><th>Key type</th><th>How it works</th><th>Best for</th></tr></thead>
  <tbody>
    <tr><td>Straight key</td><td>Press to send tone, release to stop. You make every dit and dah by hand.</td><td>Learners. Forces clean rhythm. Cheap (under $50 new).</td></tr>
    <tr><td>Single paddle</td><td>Press left for dits, right for dahs. The keyer chip generates timed elements.</td><td>15–30 WPM operators. Smoother than straight; less arm strain.</td></tr>
    <tr><td>Iambic paddle</td><td>Like single-paddle but squeezing both sends alternating dits and dahs.</td><td>20+ WPM. Steeper learning curve; faster ceiling.</td></tr>
    <tr><td>Bug (semi-automatic)</td><td>Mechanical: dits are self-completing, dahs are by hand. Vintage hardware.</td><td>Style points and contests. Distinctive sound. Steep learning curve.</td></tr>
    <tr><td>Sideswiper / cootie</td><td>Single-lever key swept left and right. All elements by hand.</td><td>SKCC and oddball-key enthusiasts.</td></tr>
  </tbody>
</table>

<p><strong>Our recommendation for month one:</strong> a straight key. It teaches you the rhythm that every other key type still depends on. Move to a paddle only when you can reliably send a clean call sign at 13 WPM on the straight key.</p>

<h2>Set up the station so your wrist doesn't quit on you</h2>

<p>Bad ergonomics will end your CW hobby faster than any technique problem. Get this right before sending a single letter:</p>

<ul>
  <li><strong>Anchor the key.</strong> Use a heavy non-slip surface or a key with a metal base. A key that slides forward every fifth letter wrecks rhythm.</li>
  <li><strong>Wrist flat, fingers relaxed.</strong> The forearm — not the fingers, not the wrist — drives the key. If your fingers are doing the work, you'll cramp before reaching 15 WPM.</li>
  <li><strong>Elbow resting on the desk.</strong> Holding the elbow up flexes the shoulder; the shoulder will betray you within five minutes. Forearm on the table from elbow to wrist.</li>
  <li><strong>Spring tension and key gap.</strong> A new straight key is usually too stiff. Loosen the spring screw to where the key falls back on its own but doesn't bounce. Gap (key-up travel) about the thickness of a credit card.</li>
</ul>

<h2>Pick a target speed — but go slower than you think</h2>

<p>The number-one rookie mistake on the sending side is sending faster than you can sustain accurately. Pick a target character speed of <strong>12–15 WPM</strong>. That's slow enough to make every element clean and fast enough that your rhythm sounds like Morse, not a slow telegraph.</p>

<p>If you don't have a sense of what 12 WPM feels like, open the <a href="/timing-calculator/">timing calculator</a> and plug in 12. A dit is 100&nbsp;ms; a dah is 300&nbsp;ms; the inter-letter gap is 300&nbsp;ms; the inter-word gap is 700&nbsp;ms. Send to those tempos out loud — "di-di-di-DAH DAH DAH di-di-di" — until the rhythm feels natural before touching a key.</p>

<h2>Drill rhythm before letters</h2>

<p>This is the step most beginners skip and most experienced ops wish they'd done. Spend a week (or even a weekend) sending nothing but the <strong>PARIS rhythm</strong>: equal-weight letters, clean gaps, no panic acceleration.</p>

<p>The drill: pick any letter — say <span class="k">E</span> (one dit) — and send it at exactly 12 WPM for two full minutes. Then switch to <span class="k">T</span> (one dah). Then <span class="k">A</span> (di-DAH). Then <span class="k">N</span> (DAH-di). Listen, not for which letter it is, but for whether the rhythm of each one matches your internal metronome.</p>

<p>Bad rhythm at this stage will haunt you at every speed above 20 WPM. Good rhythm makes a 15-WPM operator more readable than a 30-WPM operator with sloppy timing — and it's the foundation that makes head copy possible later.</p>

<h2>Build the alphabet in Koch order</h2>

<p>Once the rhythm feels comfortable, add letters in the same order you learned to copy (the <a href="/practice/">Koch trainer</a> sequence): K, M, then one new letter per session as you hit ≥ 90% clean sends.</p>

<p>For each new letter:</p>
<ol>
  <li>Send it 50 times solo, slowly, listening for clean elements.</li>
  <li>Mix it with the previous letters — 5 random groups of 5 characters.</li>
  <li>Record yourself and listen back the next day. You'll catch flaws you missed in real time.</li>
</ol>

<h2>Cross-check your sending with the decoder</h2>

<p>The fastest way to find timing flaws is to send into a decoder that doesn't care about your feelings. Open the <a href="/decoder/">live mic Morse decoder</a>, point your phone or oscillator speaker at it, and send a known word like <span class="k">PARIS</span>. If the decoder reads <span class="k">PARIS</span>, your rhythm is in spec. If it reads <span class="k">PARIE</span> or <span class="k">PARJS</span>, an element is short or a gap is wrong.</p>

<p>This is harsher than asking a human "how did that sound?" — which is exactly why it works. Use it once a week as a check-in.</p>

<h2>Get on the air — start with slow-speed nets</h2>

<p>Sending into a recorder forever is a trap. The fastest path from "competent at home" to "competent on the air" is to find a slow-speed net and check in.</p>

<ul>
  <li><strong>SKCC (Straight Key Century Club)</strong> runs slow-speed sked nights. Most operators are happy to slow down for a learner.</li>
  <li><strong>FISTS CW Club</strong> publishes a list of slow-speed CW nets by region.</li>
  <li><strong>ARRL CWops Slow Speed Net</strong> — North America's classic learner's net.</li>
</ul>

<p>What to send on your first contact:</p>

<table>
  <thead><tr><th>Step</th><th>What to send</th></tr></thead>
  <tbody>
    <tr><td>1</td><td><span class="k">DE &lt;your call&gt; &lt;your call&gt; K</span> — answer the call.</td></tr>
    <tr><td>2</td><td><span class="k">UR RST 599</span> (or your honest report).</td></tr>
    <tr><td>3</td><td><span class="k">NAME &lt;name&gt; QTH &lt;city/state&gt;</span>.</td></tr>
    <tr><td>4</td><td><span class="k">HW? BK</span> — over to them.</td></tr>
    <tr><td>5</td><td>Listen for the reply, copy, respond.</td></tr>
    <tr><td>6</td><td>End with <span class="k">73 SK &lt;your call&gt;</span>.</td></tr>
  </tbody>
</table>

<p>You'll be terrible at first. Everyone is. The on-air operator on the other end has done this a thousand times and will help. Two real QSOs will move you further than a month of drilling alone.</p>

<h2>What to skip until you've done 50 contacts</h2>

<ul>
  <li><strong>Speed contests.</strong> Get clean before you get fast. 13–15 WPM with clean rhythm beats 25 WPM with mush every single time.</li>
  <li><strong>Iambic squeeze keying.</strong> Iambic keying is great at 25+ WPM. It's a distraction at 13.</li>
  <li><strong>Buying a $500 paddle.</strong> A $50 straight key sends just as good Morse. Upgrade gear when your skill outgrows the current one.</li>
  <li><strong>Trying to sound like a contester.</strong> Contesters sound clipped and abbreviated because they're optimizing for one specific game. Casual CW QSOs sound nothing like that.</li>
</ul>

<h2>The one-line summary</h2>

<p>Buy a straight key, anchor it well, send at 12–15 WPM with clean rhythm, drill in Koch order, check yourself against the decoder, and check into a slow-speed net within a month. That's the whole sport.</p>
`,
};
