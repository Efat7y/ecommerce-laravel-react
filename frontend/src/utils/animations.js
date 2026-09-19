export const flyToCart = (e, imgSrc, targetId = "cart-icon-header", pulseColor = "text-blue-500") => {
  if (!e || !e.target) return;

  const button = e.currentTarget;
  const buttonRect = button.getBoundingClientRect();
  
  // Find icon in the header
  const targetIcon = document.getElementById(targetId);
  if (!targetIcon) return;
  const targetRect = targetIcon.getBoundingClientRect();

  // Create clone element
  const clone = document.createElement("div");
  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "cover";
    img.style.borderRadius = "50%";
    clone.appendChild(img);
  } else {
    clone.style.backgroundColor = targetId === "cart-icon-header" ? "#2563eb" : "#ef4444"; // blue-600 or red-500
  }
  
  clone.style.position = "fixed";
  clone.style.zIndex = "9999";
  clone.style.width = "40px";
  clone.style.height = "40px";
  clone.style.borderRadius = "50%";
  clone.style.top = `${buttonRect.top}px`;
  clone.style.left = `${buttonRect.left + buttonRect.width / 2 - 20}px`;
  clone.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  clone.style.boxShadow = targetId === "cart-icon-header" ? "0 10px 25px -5px rgba(37, 99, 235, 0.5)" : "0 10px 25px -5px rgba(239, 68, 68, 0.5)";
  clone.style.pointerEvents = "none";
  
  document.body.appendChild(clone);

  // Trigger animation after a tiny delay for browser to register the initial position
  setTimeout(() => {
    clone.style.top = `${targetRect.top + targetRect.height / 2 - 10}px`;
    clone.style.left = `${targetRect.left + targetRect.width / 2 - 10}px`;
    clone.style.width = "20px";
    clone.style.height = "20px";
    clone.style.opacity = "0";
    clone.style.transform = "scale(0.5)";
  }, 10);

  // Cleanup and animate icon
  setTimeout(() => {
    clone.remove();
    // Add a quick pulse animation to the icon
    targetIcon.classList.add("scale-125", pulseColor);
    setTimeout(() => {
      targetIcon.classList.remove("scale-125", pulseColor);
    }, 200);
  }, 800);
};

export const flyToWishlist = (e, imgSrc) => {
  flyToCart(e, imgSrc, "wishlist-icon-header", "text-red-500");
};
