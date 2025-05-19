import React, { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

interface ActionDropdownProps {
    actions: { label: string; onClick: () => void }[];
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState<'up' | 'down'>('down');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => {
        if (!isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const dropdownHeight = actions.length * 40; // estimativa da altura do dropdown

            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            // Se não há espaço abaixo mas há acima, abre para cima
            setDropdownPosition(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'up' : 'down');
        }

        setIsOpen(!isOpen);
    };

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 focus:outline-none"
                title="Opções"
                aria-label="Opções"
            >
                <FiMoreVertical size={20} />
            </button>

            {isOpen && (
                <div
                    className={`absolute right-0 ${dropdownPosition === 'up' ? 'bottom-full mb-2' : 'mt-2'} w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50`}
                    style={{
                        maxHeight: actions.length === 1 ? 'none' : '200px',
                        overflowY: actions.length === 1 ? 'visible' : 'auto'
                    }}
                >
                    <ul className="py-1">
                        {actions.map((action, index) => (
                            <li key={index}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick();
                                        setIsOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {action.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ActionDropdown;
