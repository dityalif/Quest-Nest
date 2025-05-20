/**
 * Generate a deterministic avatar URL using DiceBear API
 */
export function generateRandomAvatar(name) {
  // Use name or username as seed
  const seed = name ? encodeURIComponent(name) : Math.random().toString(36).substring(2, 10);

  // Deterministic hash function
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // Array of available avatar styles
  const styles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles', 'micah', 'pixel-art'];
  const bgColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];

  const hash = hashCode(seed);
  const style = styles[hash % styles.length];
  const bgColor = bgColors[hash % bgColors.length];

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bgColor}`;
}

/**
 * Get avatar URL for a user, using fallbacks if necessary
 */
export function getAvatarUrl(user) {
  // If user has an avatar, return it
  if (user?.avatar) return user.avatar;

  // If no avatar, generate a random DiceBear avatar based on name (consistent per user)
  const name = user?.name || 'User';
  return generateRandomAvatar(name);
}