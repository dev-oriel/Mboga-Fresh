import React from "react";
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-[#63cf17]/20 h-16 bg-[#f7f8f6]">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-[#182111]">User Management</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center justify-center size-10 rounded-full bg-[#f7f8f6] hover:bg-[#63cf17]/10 text-[#182111] transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <div
          className="size-10 rounded-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBtdIJcrs9Eq95rMMM1_GZhIKr8N49hBMphg95ApaibkPbJj887Dn8NJnzxk9NSZT4PAVBmff0uNsNICT0707BXXQQhDMEHs2382J0tIlaWLJnJdXQGLgg5mBIIRKA-quUe7Sb0JU3-RsQko4trqrMZqih8CwUcvUNEfIMgErz9P18YbvrLXM4qukrJGmg4l9KdCmCccdVGOJy-ekPxl0BcCYOiksZsP9lsBCssYzLN0VHZVGTO3HjLItO4ZSOychrj2kV499qqsKo")',
          }}
        ></div>
      </div>
    </header>
  );
};

export default Header;
