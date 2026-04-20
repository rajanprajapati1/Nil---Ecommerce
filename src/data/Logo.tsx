// Cart and Wishlist icons for NIL Navbar

export const CartIcon = ({ size = 22 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <g fill="none" stroke="currentColor" strokeWidth={1.25}>
      <path strokeLinecap="round" d="M8 12V8a4 4 0 1 1 8 0v4" />
      <path d="M3.694 12.668c.145-1.741.218-2.611.792-3.14S5.934 9 7.681 9h8.639c1.746 0 2.62 0 3.194.528s.647 1.399.792 3.14l.514 6.166c.084 1.013.126 1.52-.17 1.843c-.298.323-.806.323-1.824.323H5.174c-1.017 0-1.526 0-1.823-.323s-.255-.83-.17-1.843z" />
    </g>
  </svg>
);

export const WishlistIcon = ({ size = 22 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16">
    <path
      fill="currentColor"
      d="M11.5 4v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m0 6.993c1.664-1.711 5.825 1.283 0 5.132c-5.825-3.85-1.664-6.843 0-5.132"
    />
  </svg>
);
