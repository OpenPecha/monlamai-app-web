const replacements = [
  ["་\n", "་"],
  ["་ ", "་"],
  [" ་", "་"],
];

function applyReplacements(input) {
  let output = input;
  for (const [from, to] of replacements) {
    output = output.replaceAll(from, to);
  }
  return output;
}

export default applyReplacements;