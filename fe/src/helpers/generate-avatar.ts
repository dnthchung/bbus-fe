// helpers/generate-avatar.ts

// Function to generate a random avatar URL
export const generateAvatar = (): string => {
  const randomNumber = Math.floor(Math.random() * 50) + 1
  return `https://avatar.iran.liara.run/public/${randomNumber}`
}

// Function to return default avatar URL
export const defaultAvatar = (): string => {
  return 'https://res.cloudinary.com/dio2hil1s/image/upload/v1743349032/avatar_placeholder_de2fc4.png'
}
