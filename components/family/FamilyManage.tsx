import React, { useState, useMemo, useEffect } from 'react';
import { 
    ChevronLeft, Settings, FilePenLine, MessageSquareQuote, Camera, Image, 
    AlertTriangle, ChevronRight, Users, UserCog, Trophy, ClipboardList, 
    MessageCircle, Mic2, ArrowRightLeft, LogOut, Shield, Crown, User, Plus, Gift, Info, MoreHorizontal,
    Save, X, Search, Upload, Trash2, CheckCircle2, Check, UserPlus, MicOff, Ban, Star, HeartHandshake, MinusCircle
} from 'lucide-react';

interface FamilyManageProps {
    onBack: () => void;
    onSubPageChange?: (isSubPageOpen: boolean) => void;
}

type DemoRole = 'Chief' | 'Admin' | 'Member';
type SubPageType = 'name' | 'slogan' | 'avatar' | 'cover' | 'disband' | 'list' | 'roles' | 'hero' | 'config' | null;

// --- Sub-Page Components ---

const SubPageHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
    <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/95 backdrop-blur-md px-4 border-b border-white/5">
        <button 
            onClick={onBack} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition active:scale-95 flex-shrink-0"
        >
            <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white whitespace-nowrap">
            {title}
        </div>
        
        <div className="w-10"></div>
    </div>
);

const TextEditorPage = ({ title, value, onSave, onBack, multiline = false, maxLength = 30, placeholder }: any) => {
    const [text, setText] = useState(value);

    return (
        <div className="min-h-screen bg-[#0f0f11] animate-in slide-in-from-right duration-300">
            <SubPageHeader title={title} onBack={onBack} />
            <div className="p-6">
                <div className="bg-[#1a1a1d] rounded-2xl p-4 border border-white/5 relative group focus-within:border-[#A540FF]/50 transition-colors">
                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 block">
                        {multiline ? 'Content' : 'Input Text'}
                    </label>
                    {multiline ? (
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            className="w-full bg-transparent text-white text-base font-medium placeholder-gray-600 outline-none resize-none h-32 leading-relaxed"
                        />
                    ) : (
                        <input 
                            type="text" 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            maxLength={maxLength}
                            placeholder={placeholder}
                            className="w-full bg-transparent text-white text-lg font-bold placeholder-gray-600 outline-none h-10"
                        />
                    )}
                    
                    {/* Character Count & Clear */}
                    <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
                         <div className="text-xs text-gray-500 font-mono">
                            {text.length} / {maxLength}
                         </div>
                         {text.length > 0 && (
                             <button onClick={() => setText('')} className="text-gray-500 hover:text-white transition-colors p-1">
                                 <X className="w-4 h-4" />
                             </button>
                         )}
                    </div>
                </div>
                
                <div className="mt-4 flex items-start gap-3 px-2 mb-8">
                    <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                        Please ensure the content follows our community guidelines. Offensive or inappropriate content may lead to account suspension.
                    </p>
                </div>

                <button 
                    onClick={() => onSave(text)}
                    className="w-full bg-[#A540FF] hover:bg-[#9333ea] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save
                </button>
            </div>
        </div>
    );
};

const ImageEditorPage = ({ title, currentImage, onSave, onBack, isCover = false }: any) => {
    const [selectedImage, setSelectedImage] = useState(currentImage);
    const [isDefault, setIsDefault] = useState(true);

    // Mock upload function
    const handleUpload = () => {
        // Simulate a new image selection
        const newImg = isCover 
            ? "https://image.pollinations.ai/prompt/Cyberpunk%20city%20panorama%20purple%20neon?width=800&height=600&seed=999&nologo=true"
            : "https://image.pollinations.ai/prompt/Cool%20lion%20logo%20mascot%20esports?width=400&height=400&seed=888&nologo=true";
        setSelectedImage(newImg);
        setIsDefault(false);
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] animate-in slide-in-from-right duration-300">
            <SubPageHeader title={title} onBack={onBack} />
            <div className="p-6 flex flex-col items-center">
                
                {/* Preview Area */}
                <div className={`relative overflow-hidden shadow-2xl border-2 border-[#A540FF]/20 ${isCover ? 'w-full aspect-video rounded-2xl' : 'w-48 h-48 rounded-full'}`}>
                    {selectedImage ? (
                        <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                        <div className="w-full h-full bg-[#1a1a1d] flex items-center justify-center flex-col gap-2 text-gray-500">
                            <Image className="w-8 h-8" />
                            <span className="text-xs">No Image</span>
                        </div>
                    )}
                    
                    {/* Overlay Tip */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="text-white text-xs font-bold">Preview</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                    <button 
                        onClick={handleUpload}
                        className="flex flex-col items-center justify-center gap-2 p-6 bg-[#1a1a1d] rounded-2xl border border-white/5 active:scale-95 transition-all hover:bg-white/5 group"
                    >
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A540FF]/20 transition-colors">
                            <Camera className="w-5 h-5 text-gray-400 group-hover:text-[#A540FF]" />
                        </div>
                        <span className="text-sm font-medium text-gray-300">Take Photo</span>
                    </button>

                    <button 
                        onClick={handleUpload}
                        className="flex flex-col items-center justify-center gap-2 p-6 bg-[#1a1a1d] rounded-2xl border border-white/5 active:scale-95 transition-all hover:bg-white/5 group"
                    >
                         <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#A540FF]/20 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#A540FF]" />
                        </div>
                        <span className="text-sm font-medium text-gray-300">Upload</span>
                    </button>
                </div>

                <button 
                    onClick={() => onSave(selectedImage)}
                    className="w-full mt-10 bg-[#A540FF] hover:bg-[#9333ea] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>
        </div>
    );
};

const RoleAppointmentPage = ({ onBack }: any) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [targetRole, setTargetRole] = useState<{ type: string, index: number } | null>(null);
    const [memberSearchTerm, setMemberSearchTerm] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    // Mock initial assignments
    // Fixed slots: Admin (3), Streamer (10), Supporter (10)
    const [assignments, setAssignments] = useState({
        Chief: [
            { id: 'u1', name: 'Ahmed_Live', avatar: 'https://image.pollinations.ai/prompt/Handsome%20Saudi%20Arab%20man%20streamer%20wearing%20red%20shemagh%20headset%20talking%20microphone%20professional%20gaming%20studio%20purple%20lighting?width=100&height=100&seed=88&nologo=true' }
        ],
        Admin: [
            { id: 'u2', name: 'Desert_King', avatar: 'https://image.pollinations.ai/prompt/Arab%20man%20sunglasses%20cool?width=100&height=100&seed=12&nologo=true' },
            { id: 'u3', name: 'Sarah_Gamer', avatar: 'https://image.pollinations.ai/prompt/Arab%20woman%20gamer%20headset?width=100&height=100&seed=33&nologo=true' },
            null // Empty slot
        ],
        Streamer: [
            { id: 'u4', name: 'Falcon_Eye', avatar: 'https://image.pollinations.ai/prompt/Falcon%20portrait?width=100&height=100&seed=44&nologo=true' },
            null, null, null, null, null, null, null, null, null // 9 Empty
        ],
        Supporter: [
            { id: 'u5', name: 'Riyadh_Drift', avatar: 'https://image.pollinations.ai/prompt/Race%20car%20driver?width=100&height=100&seed=55&nologo=true' },
            null, null, null, null, null, null, null, null, null // 9 Empty
        ]
    });

    // Mock candidates for adding
    const candidates = Array.from({ length: 15 }).map((_, i) => ({
        id: `c${i}`,
        name: `User_${i + 100}`,
        avatar: `https://image.pollinations.ai/prompt/avatar${i + 100}?width=100&height=100&seed=${i + 100}&nologo=true`,
        verified: Math.random() > 0.6,
        followers: (Math.floor(Math.random() * 50000) + 500).toLocaleString()
    })).filter(c => c.name.toLowerCase().includes(memberSearchTerm.toLowerCase()));

    const handleRemove = (roleType: string, index: number) => {
        setAssignments(prev => {
            const newList = [...(prev as any)[roleType]];
            newList[index] = null;
            return { ...prev, [roleType]: newList };
        });
    };

    const handleOpenAdd = (roleType: string, index: number) => {
        setTargetRole({ type: roleType, index });
        setIsAddModalOpen(true);
    };

    const handleAddMember = (member: any) => {
        if (!targetRole) return;
        setAssignments(prev => {
            const newList = [...(prev as any)[targetRole.type]];
            newList[targetRole.index] = member;
            return { ...prev, [targetRole.type]: newList };
        });
        setIsAddModalOpen(false);
        setTargetRole(null);

        // Show Notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#0f0f11] animate-in slide-in-from-right duration-300 relative">
             {/* Notification Toast */}
             <div className={`fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[150] transition-all duration-500 ease-out ${showNotification ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0 pointer-events-none'}`}>
                <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 border border-gray-100/20">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600" strokeWidth={3} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">Added Successfully</div>
                        <div className="text-xs text-gray-500 font-medium leading-tight mt-0.5">They will receive a role appointment notification.</div>
                    </div>
                </div>
            </div>

            <SubPageHeader title="Role Appointment" onBack={onBack} />
            
            <div className="p-4 space-y-8 pb-20">
                
                {/* 1. Chief Section */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-white font-bold text-lg">Family Chief</h3>
                    </div>
                    {/* Chief is always singular and present */}
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-3">
                             <div className="relative w-20 h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-500 to-amber-700 shadow-lg">
                                 <img 
                                    src={assignments.Chief[0].avatar} 
                                    alt="Chief" 
                                    className="w-full h-full rounded-full object-cover border-2 border-[#1a1a1d]" 
                                 />
                                 {/* Removed Owner Badge as requested */}
                             </div>
                             <span className="text-white font-bold text-sm">{assignments.Chief[0].name}</span>
                        </div>
                    </div>
                </section>

                {/* 2. Admin Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-purple-500" />
                            <h3 className="text-white font-bold text-lg">Admin</h3>
                        </div>
                        <span className="text-xs text-gray-500">{assignments.Admin.filter(Boolean).length}/3</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4">
                        {assignments.Admin.map((member, idx) => (
                            <RoleSlot 
                                key={idx} 
                                member={member} 
                                roleType="Admin" 
                                index={idx}
                                onDelete={() => handleRemove('Admin', idx)}
                                onAdd={() => handleOpenAdd('Admin', idx)}
                            />
                        ))}
                    </div>
                    <div className="mt-3 text-[10px] text-gray-500 text-center bg-white/5 py-2 rounded-lg border border-white/5 border-dashed">
                        Upgrade family to Lv.15 to set 4 admins
                    </div>
                </section>

                {/* 3. Streamer Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-pink-500" />
                            <h3 className="text-white font-bold text-lg">Streamer</h3>
                        </div>
                         <span className="text-xs text-gray-500">{assignments.Streamer.filter(Boolean).length}/10</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                         {assignments.Streamer.map((member, idx) => (
                            <RoleSlot 
                                key={idx} 
                                member={member} 
                                roleType="Streamer" 
                                index={idx}
                                onDelete={() => handleRemove('Streamer', idx)}
                                onAdd={() => handleOpenAdd('Streamer', idx)}
                            />
                        ))}
                    </div>
                </section>

                {/* 4. Supporter Section */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <HeartHandshake className="w-5 h-5 text-blue-500" />
                            <h3 className="text-white font-bold text-lg">Supporter</h3>
                        </div>
                         <span className="text-xs text-gray-500">{assignments.Supporter.filter(Boolean).length}/10</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                         {assignments.Supporter.map((member, idx) => (
                            <RoleSlot 
                                key={idx} 
                                member={member} 
                                roleType="Supporter" 
                                index={idx}
                                onDelete={() => handleRemove('Supporter', idx)}
                                onAdd={() => handleOpenAdd('Supporter', idx)}
                            />
                        ))}
                    </div>
                </section>

                {/* Bottom Hint - Styled to match Admin section */}
                <div className="mt-6 text-[10px] text-gray-500 text-center bg-white/5 py-3 rounded-lg border border-white/5 border-dashed">
                    Upgrade family to Lv.30 to customize role names
                </div>
            </div>

            {/* Member Selection Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#1a1a1d] rounded-t-3xl border-t border-white/10 h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl">
                        {/* Modal Header */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="text-lg font-bold text-white">Select Member</div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-white/5 rounded-full">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        
                        {/* Search */}
                        <div className="p-4 border-b border-white/5">
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Search members..." 
                                    value={memberSearchTerm}
                                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                                    className="w-full bg-[#0f0f11] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-[#A540FF]/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* List - Redesigned to be flat list with dividers */}
                        <div className="flex-1 overflow-y-auto px-0 pb-10">
                            {candidates.map(candidate => (
                                <div key={candidate.id} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={candidate.avatar} className="w-12 h-12 rounded-full object-cover border border-white/10" alt={candidate.name} />
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-sm font-bold text-white">{candidate.name}</span>
                                                {candidate.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#A540FF] fill-black" />}
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-medium">Followers {candidate.followers}</div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleAddMember(candidate)}
                                        className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-xs font-bold px-6 py-2 rounded-full active:scale-95 transition-all shadow-lg shadow-purple-900/20"
                                    >
                                        Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Slot Component
const RoleSlot = ({ member, roleType, index, onDelete, onAdd }: any) => {
    return (
        <div className="flex flex-col items-center gap-2 group relative">
            {member ? (
                <>
                    <div className="relative w-14 h-14">
                        <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-full h-full rounded-full object-cover border border-white/10"
                        />
                        {/* Delete Badge */}
                        <button 
                            onClick={onDelete}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center border border-[#0f0f11] shadow-sm active:scale-90 transition-transform z-10"
                        >
                            <MinusCircle className="w-3.5 h-3.5 text-white fill-red-500" />
                        </button>
                    </div>
                    <span className="text-[10px] font-medium text-gray-300 truncate max-w-[60px] text-center">{member.name}</span>
                </>
            ) : (
                <>
                    <button 
                        onClick={onAdd}
                        className="w-14 h-14 rounded-full border border-dashed border-white/20 flex items-center justify-center bg-white/5 hover:bg-white/10 active:scale-95 transition-all group-hover:border-[#A540FF]/50"
                    >
                        <Plus className="w-5 h-5 text-gray-500 group-hover:text-[#A540FF]" />
                    </button>
                    <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-500">Add</span>
                </>
            )}
        </div>
    );
};

const MemberListPage = ({ onBack }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState<any>(null); // For Action Sheet
    
    // Mock Members with random verified status and followers
    const members = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        name: i === 0 ? "Ahmed_Live" : `Member_${i + 1}`,
        role: i === 0 ? 'Chief' : i < 3 ? 'Admin' : 'Member',
        avatar: `https://image.pollinations.ai/prompt/avatar${i}?width=100&height=100&seed=${i}&nologo=true`,
        level: Math.floor(Math.random() * 50) + 1,
        verified: Math.random() > 0.7, // Random verification
        followers: (Math.floor(Math.random() * 900000) + 1200).toLocaleString() // formatted number
    }));

    const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="min-h-screen bg-[#0f0f11] animate-in slide-in-from-right duration-300 relative">
            {/* 1. Header with Count/Max - Updated to match entry point */}
            <SubPageHeader title="Member List (20/80)" onBack={onBack} />
            
            <div className="px-4 py-3 sticky top-[73px] bg-[#0f0f11] z-30">
                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1a1a1d] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none focus:border-[#A540FF]/50 transition-colors"
                    />
                </div>

                {/* 2. Invite Button & Hint Text */}
                <div className="mb-2">
                    <button className="w-full bg-gradient-to-r from-[#A540FF] to-purple-700 hover:brightness-110 active:scale-[0.98] transition-all rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 border border-white/10">
                        <div className="bg-white/20 p-1 rounded-full">
                            <UserPlus className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">Invite New Member</span>
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-2 font-medium">
                        Upgrade family to Lv.15 to unlock member limit of 120
                    </p>
                </div>
            </div>

            <div className="pb-20 mt-0">
                <div className="bg-[#1a1a1d] rounded-2xl mx-4 overflow-hidden border border-white/5">
                    {filteredMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={member.avatar} className="w-12 h-12 rounded-full object-cover" alt={member.name} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    {/* Line 1: Name + Verified */}
                                    <div className="flex items-center gap-1.5">
                                        <div className="text-sm font-bold text-white leading-none">{member.name}</div>
                                        {member.verified && (
                                            <div className="bg-[#A540FF] rounded-full p-[2px] flex items-center justify-center">
                                                <Check size={8} className="text-white" strokeWidth={4} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Line 2: Role */}
                                    <div className={`text-[10px] inline-block font-bold tracking-wide ${
                                        member.role === 'Chief' ? 'text-yellow-500' :
                                        member.role === 'Admin' ? 'text-purple-400' :
                                        'text-gray-400'
                                    }`}>
                                        {member.role}
                                    </div>

                                    {/* Line 3: Followers */}
                                    <div className="text-[10px] text-gray-500 font-medium">
                                        Followers {member.followers}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 3. More Action Button */}
                            <button 
                                onClick={() => setSelectedMember(member)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 group-hover:text-white transition-colors"
                            >
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Action Sheet / Context Menu */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end items-center">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedMember(null)}
                    />
                    
                    {/* Menu Content */}
                    <div className="relative w-full max-w-md bg-[#1a1a1d] rounded-t-3xl border-t border-white/10 p-6 animate-in slide-in-from-bottom duration-300 shadow-2xl">
                        {/* Drag Handle */}
                        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>

                        {/* Selected User Summary */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                            <img src={selectedMember.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-[#A540FF]/20" alt={selectedMember.name} />
                            <div>
                                <div className="text-lg font-bold text-white flex items-center gap-1">
                                    {selectedMember.name}
                                    {selectedMember.verified && <CheckCircle2 className="w-4 h-4 text-[#A540FF] fill-black" />}
                                </div>
                                <div className="text-sm text-gray-400">{selectedMember.role} • Followers {selectedMember.followers}</div>
                            </div>
                        </div>

                        {/* Actions Grid */}
                        <div className="space-y-3">
                            <button className="w-full bg-[#252529] hover:bg-[#2f2f33] active:scale-[0.99] transition-all p-4 rounded-xl flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                        <Ban className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-red-500">Kick Out</div>
                                        <div className="text-[10px] text-gray-500">Remove from family permanently</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                            </button>

                            <button className="w-full bg-[#252529] hover:bg-[#2f2f33] active:scale-[0.99] transition-all p-4 rounded-xl flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                        <MicOff className="w-5 h-5 text-yellow-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-sm font-bold text-yellow-500">Mute Member</div>
                                        <div className="text-[10px] text-gray-500">Disable chat for 24 hours</div>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Cancel Button */}
                        <button 
                            onClick={() => setSelectedMember(null)}
                            className="w-full mt-6 bg-[#0f0f11] text-gray-400 font-bold py-4 rounded-xl active:scale-[0.98] border border-white/5 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export const FamilyManage: React.FC<FamilyManageProps> = ({ onBack, onSubPageChange }) => {
    const [demoRole, setDemoRole] = useState<DemoRole>('Chief');
    const [activeSubPage, setActiveSubPage] = useState<SubPageType>(null);
    
    // Notify parent about sub-page state
    useEffect(() => {
        if (onSubPageChange) {
            onSubPageChange(activeSubPage !== null);
        }
    }, [activeSubPage, onSubPageChange]);
    
    // Family Data State (Lifted up to be editable)
    const [familyData, setFamilyData] = useState({
        name: 'Royal Lions',
        slogan: 'We roar together, we win together! 🦁',
        avatar: 'https://image.pollinations.ai/prompt/Esports%20team%20logo%20shield%20purple%20lion?width=100&height=100&seed=45&nologo=true',
        cover: 'https://img.jacocdn.com/large/3b9ae203la1i8yryvrmrxj20rs0rpnpd.jpg'
    });

    const handleSubPageSave = (key: keyof typeof familyData, value: string) => {
        setFamilyData(prev => ({ ...prev, [key]: value }));
        setActiveSubPage(null);
    };

    // Render Sub-Pages Conditional Logic
    if (activeSubPage === 'name') {
        return <TextEditorPage 
            title="Edit Family Name" 
            value={familyData.name} 
            maxLength={20}
            placeholder="Enter family name"
            onBack={() => setActiveSubPage(null)} 
            onSave={(val: string) => handleSubPageSave('name', val)} 
        />;
    }

    if (activeSubPage === 'slogan') {
        return <TextEditorPage 
            title="Edit Slogan" 
            value={familyData.slogan} 
            multiline 
            maxLength={100}
            placeholder="Enter family slogan"
            onBack={() => setActiveSubPage(null)} 
            onSave={(val: string) => handleSubPageSave('slogan', val)} 
        />;
    }

    if (activeSubPage === 'avatar') {
        return <ImageEditorPage 
            title="Edit Avatar" 
            currentImage={familyData.avatar} 
            onBack={() => setActiveSubPage(null)} 
            onSave={(val: string) => handleSubPageSave('avatar', val)} 
        />;
    }

    if (activeSubPage === 'cover') {
        return <ImageEditorPage 
            title="Edit Cover" 
            currentImage={familyData.cover} 
            isCover
            onBack={() => setActiveSubPage(null)} 
            onSave={(val: string) => handleSubPageSave('cover', val)} 
        />;
    }

    if (activeSubPage === 'list') {
        return <MemberListPage onBack={() => setActiveSubPage(null)} />;
    }

    if (activeSubPage === 'roles') {
        return <RoleAppointmentPage onBack={() => setActiveSubPage(null)} />;
    }

    // General Settings Configuration
    const generalSections = [
        {
            id: 'management',
            title: "Family Information",
            items: [
                { id: 'name', page: 'name', icon: FilePenLine, label: 'Family Name', value: familyData.name, badge: '1 Rename Card' },
                { id: 'slogan', page: 'slogan', icon: MessageSquareQuote, label: 'Family Slogan', value: familyData.slogan, truncate: true },
                { id: 'avatar', page: 'avatar', icon: Camera, label: 'Family Avatar', value: '' },
                { id: 'cover', page: 'cover', icon: Image, label: 'Background Cover', value: 'Lv.5 Required' }, // Removed locked:true to allow demo
                { 
                    id: 'disband', page: null, icon: AlertTriangle, label: 'Disband Family', value: '', 
                    textColor: 'text-red-500', subtitle: 'Disband a family above Lv 10 requires the consent of at least 5 members' 
                }
            ]
        },
        {
            id: 'members',
            title: "Member Management",
            items: [
                { id: 'list', page: 'list', icon: Users, label: 'Member List', value: '20 / 80' },
                { id: 'roles', page: 'roles', icon: UserCog, label: 'Role Appointment', value: '' }, // Updated to 'roles' page
                { id: 'hero', page: null, icon: Trophy, label: 'Hero Hall Setting', value: 'Lv.10 Required', locked: true },
            ]
        },
        {
            id: 'tasks',
            title: "Task Configuration",
            items: [
                { id: 'config', page: null, icon: ClipboardList, label: 'Family Tasks', value: '3 Active' },
            ]
        }
    ];

    // Filter Logic based on Role
    const getVisibleSections = () => {
        return generalSections.map(section => {
            if (demoRole === 'Member') {
                if (['management', 'members', 'tasks'].includes(section.id)) return null;
            }
            const visibleItems = section.items.filter(item => {
                if (demoRole === 'Admin' && item.id === 'disband') return false;
                return true;
            });
            if (visibleItems.length === 0) return null;
            return { ...section, items: visibleItems };
        }).filter(Boolean);
    };

    const visibleSections = getVisibleSections();

    // Interaction Section (Chats)
    const renderInteractionSection = () => {
        return (
            <div className="mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Family Interaction</h3>
                <div className="bg-[#1a1a1d] rounded-2xl overflow-hidden border border-white/5 shadow-sm divide-y divide-white/5">
                    
                    {/* 1. Group Chats */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-white">Group Chats</span>
                                    <span className="text-[10px] text-gray-500">Official family communication channels</span>
                                </div>
                            </div>
                             <span className="text-xs text-gray-500 font-medium">
                                {demoRole !== 'Member' ? (
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded border border-yellow-500/20 font-bold">Lv 12</span>
                                        <span>2/5 Created</span>
                                    </div>
                                ) : (
                                    <span className="text-gray-600">Enter</span>
                                )}
                            </span>
                        </div>
                        
                        <div className="flex items-start gap-4 pl-11 overflow-x-auto no-scrollbar">
                            <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] relative">
                                    <img 
                                        src={familyData.avatar}
                                        className="w-full h-full object-cover rounded-full"
                                        alt="Main"
                                    />
                                </div>
                                <span className="text-[10px] text-gray-300 font-medium truncate max-w-[60px]">Main Hall</span>
                            </div>
                            {demoRole !== 'Member' && (
                                <div className="flex flex-col items-center gap-2 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-full bg-[#2a2a2d] flex items-center justify-center border border-white/5">
                                        <Shield className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <span className="text-[10px] text-gray-300 font-medium truncate max-w-[60px]">Admins</span>
                                </div>
                            )}
                            {demoRole !== 'Member' && (
                                <button className="flex flex-col items-center gap-2 group">
                                    <div className="w-12 h-12 rounded-full border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors active:scale-95">
                                        <Plus className="w-5 h-5 text-gray-400 group-hover:text-[#A540FF]" />
                                    </div>
                                    <span className="text-[10px] text-gray-500 group-hover:text-[#A540FF] transition-colors">Create</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 2. Majlis LIVE */}
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                    <Mic2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Start Majlis</div>
                                </div>
                             </div>
                             <button className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-xs font-bold px-5 py-1.5 rounded-full transition-colors active:scale-95 shadow-lg shadow-purple-500/20">
                                Start
                             </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2 pl-11 leading-relaxed">
                            Host a voice room exclusively for family members. Earn family EXP together.
                        </p>
                    </div>

                    {/* 3. Family BOX */}
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                    <Gift className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Family Box</div>
                                </div>
                             </div>
                             <button className="bg-[#A540FF] hover:bg-[#9333ea] text-white text-xs font-bold px-5 py-1.5 rounded-full transition-colors active:scale-95 shadow-lg shadow-purple-500/20">
                                Send
                             </button>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-2 pl-11 leading-relaxed">
                            Send a surprise box containing Coins or Gems to active members currently online.
                        </p>
                    </div>

                </div>
            </div>
        );
    };

    return (
        <div className="pb-40 min-h-screen bg-[#0f0f11] relative animate-in fade-in duration-300">
             {/* Header */}
             <div className="sticky top-0 left-0 w-full z-50 py-4 flex items-center justify-between bg-[#0f0f11]/80 backdrop-blur-md px-4 border-b border-white/5 relative">
                <button 
                    onClick={onBack} 
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/40 transition active:scale-95 flex-shrink-0"
                >
                <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white flex items-center gap-2">
                    <MoreHorizontal className="w-5 h-5 text-[#A540FF]" />
                    More
                </div>
                
                <div className="w-10"></div>
             </div>

             {/* Settings Content */}
             <div className="px-4 pt-6">
                
                {visibleSections.map((section: any, idx) => (
                    <div key={section.id} className="mb-6 animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{section.title}</h3>
                        <div className="bg-[#1a1a1d] rounded-2xl overflow-hidden border border-white/5 shadow-sm">
                            {section.items.map((item: any, itemIdx: number) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => !item.locked && item.page && setActiveSubPage(item.page as SubPageType)}
                                    className={`flex items-center justify-between p-4 active:bg-white/5 transition-colors cursor-pointer group ${
                                        itemIdx !== section.items.length - 1 ? 'border-b border-white/5' : ''
                                    } ${item.locked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white/10 transition-colors">
                                            <item.icon className={`w-4 h-4 ${item.textColor || ''}`} />
                                        </div>
                                        <div className="flex flex-col max-w-[180px]">
                                            <span className={`text-sm font-medium ${item.textColor || 'text-white'}`}>{item.label}</span>
                                            {item.subtitle && <span className="text-[9px] text-gray-500 font-medium mt-0.5 leading-tight">{item.subtitle}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {item.badge && <span className="text-[9px] bg-[#A540FF]/20 text-[#A540FF] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
                                        <span className={`text-xs ${item.locked ? 'text-gray-600' : 'text-gray-400'} font-medium truncate max-w-[100px] text-right`}>
                                            {item.truncate ? (item.value.length > 15 ? item.value.substring(0, 15) + '...' : item.value) : item.value}
                                        </span>
                                        {!item.locked && <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {renderInteractionSection()}

                <div className="mt-8 space-y-3">
                    {demoRole === 'Chief' && (
                        <button className="w-full bg-[#1a1a1d] active:scale-[0.98] transition-all border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                    <ArrowRightLeft className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-white">Transfer Ownership</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </button>
                    )}

                    {demoRole !== 'Chief' && (
                        <button className="w-full bg-[#1a1a1d] active:scale-[0.98] transition-all border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                    <LogOut className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-red-500">Leave Family</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                        </button>
                    )}
                </div>
             </div>

             <div className="mt-12 px-6 pb-8 pt-6 border-t border-white/5 bg-[#0f0f11] flex flex-col items-center">
                 <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4">
                    Toggle Role to View Demo
                 </div>
                 
                 <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                     <button 
                        onClick={() => setDemoRole('Chief')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 ${
                            demoRole === 'Chief' 
                            ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                            : 'bg-[#1a1a1d] border-white/5 text-gray-500 hover:bg-white/5'
                        }`}
                     >
                         <Crown className="w-5 h-5 mb-1.5" />
                         <span className="text-xs font-bold">I'm Chief</span>
                     </button>

                     <button 
                        onClick={() => setDemoRole('Admin')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 ${
                            demoRole === 'Admin' 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                            : 'bg-[#1a1a1d] border-white/5 text-gray-500 hover:bg-white/5'
                        }`}
                     >
                         <Shield className="w-5 h-5 mb-1.5" />
                         <span className="text-xs font-bold">I'm Admin</span>
                     </button>

                     <button 
                        onClick={() => setDemoRole('Member')}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all active:scale-95 ${
                            demoRole === 'Member' 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                            : 'bg-[#1a1a1d] border-white/5 text-gray-500 hover:bg-white/5'
                        }`}
                     >
                         <User className="w-5 h-5 mb-1.5" />
                         <span className="text-xs font-bold">I'm Member</span>
                     </button>
                 </div>
                 
                 <div className="mt-4 text-[10px] text-gray-600 text-center px-4">
                     {demoRole === 'Chief' && "Full access. Can Disband/Transfer. Cannot Leave."}
                     {demoRole === 'Admin' && "Can Manage Members & Tasks. Cannot Disband/Transfer."}
                     {demoRole === 'Member' && "Read-only access to most settings. Can Leave Family."}
                 </div>
             </div>
        </div>
    );
};