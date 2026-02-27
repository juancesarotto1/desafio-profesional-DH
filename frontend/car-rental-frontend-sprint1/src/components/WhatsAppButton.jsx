import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn shadow"
            title="Escríbenos por WhatsApp"
        >
            <MessageCircle size={32} />

            <style jsx="true">{`
        .whatsapp-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background-color: #25d366;
          color: white;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        .whatsapp-btn:hover {
          transform: scale(1.1);
          background-color: #128c7e;
          color: white;
        }
      `}</style>
        </a>
    );
};

export default WhatsAppButton;
