/**
 * Generate a random avatar URL using DiceBear API
 */
export function generateRandomAvatar(name) {
  // Use name as seed if available, otherwise random
  const seed = name ? encodeURIComponent(name) : Math.random().toString(36).substring(2, 10);
  
  // Array of available avatar styles
  const styles = ['adventurer', 'avataaars', 'big-ears', 'bottts', 'croodles', 'micah', 'pixel-art'];
  const style = styles[Math.floor(Math.random() * styles.length)];
  
  // Generate a random background color
  const bgColors = ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'];
  const bgColor = bgColors[Math.floor(Math.random() * bgColors.length)];
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=${bgColor}`;
}

/**
 * Get avatar URL for a user, using fallbacks if necessary
 */
export function getAvatarUrl(user) {
  // If user has an avatar, return it
  if (user?.avatar) return user.avatar;
  
  // If no avatar, generate one based on initials
  const name = user?.name || 'User';
  const initials = name.split(' ').map(n => n[0]).join('');
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
}