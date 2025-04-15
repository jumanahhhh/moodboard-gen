// This is a simplified version of the palette generator
// In a real application, this would likely call an API or use a more sophisticated algorithm

// export async function generatePalette(prompt: string) {
//   // Simulate API call delay
//   await new Promise((resolve) => setTimeout(resolve, 1000))

//   // Generate a base color based on the prompt
//   const baseColors: Record<string, string> = {
//     calm: "#a8d5e2",
//     serene: "#d5e2a8",
//     bold: "#e2a8d5",
//     energetic: "#e2d5a8",
//     minimalist: "#e8e8e8",
//     clean: "#ffffff",
//     warm: "#e2a8a8",
//     cozy: "#d5a8e2",
//     earth: "#a8e2a8",
//     pastel: "#f0d0e0",
//     vibrant: "#a8a8e2",
//     modern: "#a8e2d5",
//     vintage: "#e2c0a8",
//     natural: "#c0e2a8",
//   }

//   // Find a matching base color or use a default
//   let baseColor = "#a8d5e2" // Default calm blue

//   for (const [key, color] of Object.entries(baseColors)) {
//     if (prompt.toLowerCase().includes(key)) {
//       baseColor = color
//       break
//     }
//   }

//   // Generate a palette from the base color
//   const palette = generateComplementaryPalette(baseColor)

//   // Select fonts based on the prompt
//   const fonts = selectFonts(prompt)

//   return {
//     base_color: baseColor,
//     color_palette: palette,
//     fonts,
//   }
// }
export async function generatePalette(prompt: string) {
  const response = await fetch("/api/palette", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  })

  const data = await response.json()

  return {
    base_color: data.color_palette[0],
    color_palette: data.color_palette,
    fonts: data.fonts,
  }
}

function generateComplementaryPalette(baseColor: string): string[] {
  // Convert hex to RGB
  const r = Number.parseInt(baseColor.slice(1, 3), 16)
  const g = Number.parseInt(baseColor.slice(3, 5), 16)
  const b = Number.parseInt(baseColor.slice(5, 7), 16)

  // Generate a 5-color palette
  const palette = [
    baseColor,
    shiftColor(r, g, b, 30, 0, 0), // Warmer
    shiftColor(r, g, b, 0, 30, 0), // More green
    shiftColor(r, g, b, 0, 0, 30), // More blue
    shiftColor(r, g, b, -30, -30, -30), // Darker shade
  ]

  return palette
}

function shiftColor(r: number, g: number, b: number, dr: number, dg: number, db: number): string {
  // Adjust and clamp RGB values
  const newR = Math.min(255, Math.max(0, r + dr))
  const newG = Math.min(255, Math.max(0, g + dg))
  const newB = Math.min(255, Math.max(0, b + db))

  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`
}

function selectFonts(prompt: string): string[] {
  const fontCategories: Record<string, string[]> = {
    modern: ["Montserrat", "Roboto", "Inter"],
    elegant: ["Playfair Display", "Cormorant Garamond", "Libre Baskerville"],
    minimalist: ["Helvetica Neue", "Open Sans", "Work Sans"],
    creative: ["Poppins", "Quicksand", "Comfortaa"],
    vintage: ["Abril Fatface", "Lora", "Merriweather"],
    bold: ["Raleway", "Oswald", "Bebas Neue"],
    playful: ["Pacifico", "Caveat", "Amatic SC"],
  }

  // Default fonts
  let selectedFonts = ["Montserrat", "Open Sans", "Roboto"]

  // Find matching font categories
  for (const [category, fonts] of Object.entries(fontCategories)) {
    if (prompt.toLowerCase().includes(category)) {
      selectedFonts = fonts
      break
    }
  }

  return selectedFonts
}
