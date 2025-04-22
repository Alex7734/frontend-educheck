import React, { createContext, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

const ModalContext = createContext(
  {} as {
    showModal: (component: React.ReactNode, title: string) => void;
    hideModal: () => void;
    isVisible: boolean;
    hideNav: boolean;
    setHideNav: (hideNav: boolean) => void;
  }
);

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [title, setTitle] = useState('');

  const showModal = (component: React.ReactNode, title: string) => {
    setContent(component);
    setTitle(title);
    setIsVisible(true);
  };

  const hideModal = () => {
    setIsVisible(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, isVisible, hideNav, setHideNav }}>
      {children}
      {isVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: 20
          }}
            className={'rounded-xl shadow-xl'}
          >
            <div className="relative w-[95%] h-full flex flex-row mb-4 justify-between">
              <p className={'text-black font-semibold leading-3'}>
                {title}
              </p>
              <button onClick={hideModal}>
                <FontAwesomeIcon icon={faClose} size="sm" className="text-black absolute w-4 h-4 pr-4 top-0 pb-2" />
              </button>
            </div>

            {content}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
