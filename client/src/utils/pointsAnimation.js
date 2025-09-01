// Utility function to trigger flying points animation
export const triggerPointsAnimation = (points, sourceElement = null) => {
  let position = { x: '50%', y: '50%' };
  
  if (sourceElement) {
    const rect = sourceElement.getBoundingClientRect();
    position = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  }
  
  // Dispatch custom event for navbar to listen
  const event = new CustomEvent('pointsEarned', {
    detail: { points, position }
  });
  window.dispatchEvent(event);
  
  // Animate navbar points display
  const navbarPoints = document.getElementById('navbar-points');
  if (navbarPoints) {
    navbarPoints.classList.add('animate');
    setTimeout(() => {
      navbarPoints.classList.remove('animate');
    }, 600);
  }
};

export default triggerPointsAnimation;