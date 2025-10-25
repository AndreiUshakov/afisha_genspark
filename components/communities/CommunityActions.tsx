'use client';

import { useState } from 'react';

interface CommunityActionsProps {
  communityId: string;
  communityName: string;
  initialJoined?: boolean;
}

export default function CommunityActions({ 
  communityId, 
  communityName, 
  initialJoined = false 
}: CommunityActionsProps) {
  const [isJoined, setIsJoined] = useState(initialJoined);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleJoinClick = () => {
    setIsJoined(!isJoined);
    // TODO: Save to Supabase when integrated
    if (!isJoined) {
      console.log('Joined community:', communityId);
    } else {
      console.log('Left community:', communityId);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Присоединяйтесь к сообществу: ${communityName}`;

    switch (platform) {
      case 'vk':
        window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Ссылка скопирована в буфер обмена!');
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Join/Leave Button */}
      <button
        onClick={handleJoinClick}
        className={`flex-1 min-w-[200px] px-6 py-3 font-semibold rounded-lg transition-colors ${
          isJoined
            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isJoined ? 'Покинуть сообщество' : 'Вступить в сообщество'}
      </button>

      {/* Share Button */}
      <div className="relative">
        <button
          onClick={() => setShowShareMenu(!showShareMenu)}
          className="p-3 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label="Поделиться"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>

        {/* Share Menu */}
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />
            {/* Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="py-2">
                <button
                  onClick={() => handleShare('vk')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.35 14.31h-1.55c-.54 0-.71-.43-1.67-1.39-.85-.83-1.22-.94-1.43-.94-.3 0-.38.08-.38.45v1.26c0 .34-.11.54-1 .54-1.47 0-3.1-.89-4.25-2.55-1.72-2.47-2.19-4.33-2.19-4.71 0-.21.08-.4.45-.4h1.55c.34 0 .47.15.6.51.65 1.94 1.76 3.64 2.21 3.64.17 0 .25-.08.25-.52V9.47c-.05-.88-.52-1-.52-1.31 0-.17.14-.34.37-.34h2.44c.29 0 .39.15.39.48v2.59c0 .29.13.38.21.38.17 0 .31-.09.63-.41 1-.1 1.72-2.04 1.72-2.04.09-.2.24-.4.61-.4h1.55c.37 0 .45.19.37.48-.15.71-.74 1.76-1.28 2.52-.15.2-.21.3 0 .53.15.18.64.62 1 1 .6.64 1.07 1.18 1.19 1.56.13.37-.07.56-.44.56z"/>
                  </svg>
                  ВКонтакте
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                  Telegram
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Скопировать ссылку
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
