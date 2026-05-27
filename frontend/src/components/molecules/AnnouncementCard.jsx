import React from 'react'

export default function AnnouncementCard({ tag = 'Update', title, excerpt, image }) {
  const cardImage = image
  const cardTone = tag === 'Innovation' ? 'saturate-125 hue-rotate-15' : tag === 'Public Service' ? 'grayscale-[10%] contrast-110' : 'saturate-110'

  return (
    <article className="group flex cursor-pointer flex-col gap-4 rounded-xl border border-transparent p-1 transition-all duration-200 hover:border-[#cfe6f2] hover:bg-white/40">
      <div className="aspect-video overflow-hidden rounded-xl shadow-sm">
        <img src={cardImage} alt={title} className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${cardTone}`} />
      </div>
      <div>
        <span className={`rounded px-2 py-0.5 text-[12px] font-medium ${tag === 'Innovation' ? 'bg-[#00629e]/5 text-[#00629e]' : tag === 'Public Service' ? 'bg-[#ba1a1a]/5 text-[#ba1a1a]' : 'bg-[#00450d]/5 text-[#00450d]'}`}>
          {tag}
        </span>
        <h3 className="mt-2 text-[20px] font-medium leading-7 text-[#071e27] transition-colors group-hover:text-[#00450d]">{title}</h3>
        <p className="mt-2 text-[14px] leading-5 text-[#41493e]">{excerpt}</p>
      </div>
    </article>
  )
}
