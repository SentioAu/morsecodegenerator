// Daily Morse Challenge — word list + day math.
//
// The puzzle is fully static: everyone in the world gets the same word
// because everyone computes the same day number from UTC. No backend,
// no timezone drama (the word flips at 00:00 UTC like Wordle's spirit,
// if not its letter).
//
// List rules:
//  - exactly 5 letters, A–Z only (every letter has Morse)
//  - common English words a non-native speaker can plausibly guess
//  - nothing offensive, nothing obscure-Scrabble
//
// The day-to-word mapping uses a prime multiplier so consecutive days
// don't walk the list in order (casual spoiler resistance only — the
// answer is always computable from source, exactly like Wordle was).
// Keep the list length NOT a multiple of 137 or the cycle degenerates.

export const DAILY_EPOCH_UTC = "2026-06-11"; // launch day == puzzle #1

export const DAILY_WORDS = [
  "ABOUT", "ABOVE", "ACTOR", "ADMIT", "ADOPT", "AFTER", "AGAIN", "AGENT",
  "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIKE", "ALIVE", "ALLOW",
  "ALONE", "ALONG", "ANGEL", "ANGER", "ANGLE", "ANKLE", "APPLE", "APPLY",
  "ARENA", "ARGUE", "ARISE", "ARMOR", "AROMA", "ARRAY", "ARROW", "ASIDE",
  "AUDIO", "AVOID", "AWAKE", "AWARD", "AWARE", "BADGE", "BAKER", "BASIC",
  "BEACH", "BEGIN", "BEING", "BELOW", "BENCH", "BERRY", "BIRTH", "BLACK",
  "BLADE", "BLAME", "BLANK", "BLAST", "BLAZE", "BLEND", "BLESS", "BLIND",
  "BLOCK", "BLOOM", "BOARD", "BONUS", "BOOST", "BRAIN", "BRAND", "BRAVE",
  "BREAD", "BREAK", "BRICK", "BRIDE", "BRIEF", "BRING", "BROAD", "BROWN",
  "BRUSH", "BUILD", "CABIN", "CABLE", "CANDY", "CARGO", "CARRY", "CATCH",
  "CAUSE", "CHAIN", "CHAIR", "CHALK", "CHARM", "CHART", "CHASE", "CHEAP",
  "CHECK", "CHESS", "CHEST", "CHIEF", "CHILD", "CHOIR", "CHORD", "CIVIC",
  "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLIMB", "CLOCK", "CLOSE", "CLOUD",
  "COACH", "COAST", "COLOR", "COMET", "CORAL", "COUCH", "COUNT", "COURT",
  "COVER", "CRAFT", "CRANE", "CRASH", "CREAM", "CRISP", "CROWD", "CROWN",
  "CYCLE", "DAILY", "DAIRY", "DANCE", "DELAY", "DELTA", "DEPTH", "DERBY",
  "DIARY", "DIGIT", "DINER", "DODGE", "DOZEN", "DRAFT", "DRAIN", "DRAMA",
  "DREAM", "DRESS", "DRIFT", "DRILL", "DRINK", "DRIVE", "EAGER", "EAGLE",
  "EARLY", "EARTH", "EIGHT", "ELBOW", "EMPTY", "ENJOY", "ENTER", "EQUAL",
  "ERROR", "EVENT", "EVERY", "EXACT", "EXTRA", "FABLE", "FAITH", "FANCY",
  "FAVOR", "FEAST", "FENCE", "FIBER", "FIELD", "FIFTY", "FIGHT", "FINAL",
  "FIRST", "FLAME", "FLASH", "FLEET", "FLOAT", "FLOCK", "FLOOD", "FLOOR",
  "FLOUR", "FLUTE", "FOCUS", "FORCE", "FORUM", "FORGE", "FORTH", "FORTY",
  "FOUND", "FRAME", "FRESH", "FRONT", "FROST", "FRUIT", "FUNNY", "GIANT",
  "GLASS", "GLOBE", "GLORY", "GLOVE", "GRACE", "GRAIN", "GRAND", "GRANT",
  "GRAPE", "GRASP", "GRASS", "GREAT", "GREEN", "GREET", "GRILL", "GROUP",
  "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY", "HEART", "HONEY", "HORSE",
  "HOTEL", "HOUSE", "HUMAN", "HUMOR", "IDEAL", "IMAGE", "INDEX", "INPUT",
  "ISSUE", "JOINT", "JUDGE", "JUICE", "KAYAK", "KNOCK", "LABEL", "LARGE",
  "LASER", "LAUGH", "LAYER", "LEARN", "LEMON", "LEVEL", "LIGHT", "LOCAL",
  "LOGIC", "LOYAL", "LUCKY", "LUNAR", "LUNCH", "MAGIC", "MAJOR", "MAPLE",
  "MARCH", "MATCH", "MEDAL", "MEDIA", "MERCY", "MERIT", "METAL", "METER",
  "MIGHT", "MINOR", "MINUS", "MODEL", "MONEY", "MONTH", "MORAL", "MORSE",
  "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVIE", "MUSIC", "NIGHT", "NOBLE",
  "NOISE", "NORTH", "NOVEL", "NURSE", "OCEAN", "OFFER", "OLIVE", "ONION",
  "ORBIT", "ORDER", "ORGAN", "OTHER", "OUNCE", "PAINT", "PANEL", "PAPER",
  "PARTY", "PATCH", "PAUSE", "PEACE", "PEACH", "PEARL", "PHONE", "PHOTO",
  "PIANO", "PILOT", "PITCH", "PIZZA", "PLACE", "PLAIN", "PLANE", "PLANT",
  "PLATE", "POINT", "POUND", "POWER", "PRESS", "PRICE", "PRIDE", "PRIME",
  "PRINT", "PRIZE", "PROOF", "PROUD", "PULSE", "PUPIL", "QUEEN", "QUEST",
  "QUICK", "QUIET", "QUILT", "RADAR", "RADIO", "RAISE", "RANCH", "RANGE",
  "RAPID", "REACH", "REACT", "READY", "REBEL", "RELAY", "REPLY", "RHYME",
  "RIDGE", "RIGHT", "RIVAL", "RIVER", "ROAST", "ROBIN", "ROBOT", "ROCKY",
  "ROUND", "ROUTE", "ROYAL", "RURAL", "SAINT", "SALAD", "SCALE", "SCENE",
  "SCOPE", "SCORE", "SCOUT", "SENSE", "SERVE", "SEVEN", "SHADE", "SHAKE",
  "SHAPE", "SHARE", "SHARP", "SHEEP", "SHEET", "SHELF", "SHELL", "SHIFT",
  "SHINE", "SHIRT", "SHORE", "SHORT", "SHOUT", "SIGHT", "SIGMA", "SKILL",
  "SLEEP", "SLICE", "SMALL", "SMART", "SMILE", "SMOKE", "SNACK", "SOLAR",
  "SOLID", "SOLVE", "SOUND", "SOUTH", "SPACE", "SPARE", "SPARK", "SPEAK",
  "SPEED", "SPELL", "SPEND", "SPICE", "SPLIT", "SPORT", "SQUAD", "STAGE",
  "STAIR", "STAMP", "STAND", "START", "STEAM", "STEEL", "STICK", "STILL",
  "STONE", "STORM", "STORY", "STOVE", "STYLE", "SUGAR", "SUITE", "SUNNY",
  "SUPER", "SWEET", "SWIFT", "TABLE", "TASTE", "TEACH", "TEETH", "TEMPO",
  "TENTH", "THANK", "THEME", "THICK", "THING", "THINK", "THIRD", "THUMB",
  "TIGER", "TIMER", "TITLE", "TOAST", "TODAY", "TOKEN", "TOPIC", "TORCH",
  "TOTAL", "TOUCH", "TOWER", "TRACE", "TRACK", "TRADE", "TRAIL", "TRAIN",
  "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRUST", "TRUTH", "TWICE",
  "UNCLE", "UNDER", "UNION", "UNITY", "UPPER", "URBAN", "USAGE", "VALUE",
  "VAPOR", "VIDEO", "VIRUS", "VISIT", "VITAL", "VIVID", "VOCAL", "VOICE",
  "WAGON", "WASTE", "WATCH", "WATER", "WHALE", "WHEAT", "WHEEL", "WHILE",
  "WHITE", "WHOLE", "WIDTH", "WORLD", "WORTH", "WOUND", "WRIST", "WRITE",
  "WRONG", "YACHT", "YIELD", "YOUNG", "YOUTH", "ZEBRA",
];
