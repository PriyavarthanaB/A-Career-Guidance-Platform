import sys, re

def process(file_path, out_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply general rules
    content = content.replace('lg:ml-[280px]', 'lg:ml-[260px]')
    content = content.replace('bg-[#f8f9ff]', '')
    content = content.replace('text-[#0b1c30]', 'text-white')
    content = content.replace('bg-white/85', 'bg-slate-900/60')
    content = content.replace('bg-white/90', 'bg-slate-900/60')
    content = content.replace('bg-white/80', 'bg-slate-900/60')
    content = content.replace('bg-white', 'bg-slate-900/60')
    content = content.replace('bg-slate-50', 'bg-slate-800/50')
    content = content.replace('bg-blue-50', 'bg-blue-500/10')
    content = content.replace('bg-emerald-50', 'bg-emerald-500/10')
    content = content.replace('bg-amber-50', 'bg-amber-500/10')
    content = content.replace('bg-rose-50', 'bg-rose-500/10')
    content = content.replace('bg-indigo-50', 'bg-indigo-500/10')
    content = content.replace('bg-purple-50', 'bg-purple-500/10')
    
    content = content.replace('bg-blue-100', 'bg-blue-500/20')
    content = content.replace('bg-emerald-100', 'bg-emerald-500/20')
    content = content.replace('bg-amber-100', 'bg-amber-500/20')
    content = content.replace('bg-rose-100', 'bg-rose-500/20')
    content = content.replace('bg-indigo-100', 'bg-indigo-500/20')
    content = content.replace('bg-purple-100', 'bg-purple-500/20')

    content = content.replace('ring-1 ring-slate-900/5', 'ring-1 ring-white/[0.06]')
    content = content.replace('border-slate-200', 'border-white/[0.08]')
    content = content.replace('border-slate-100', 'border-white/[0.06]')
    content = content.replace('text-slate-700', 'text-slate-300')
    content = content.replace('text-slate-800', 'text-slate-300')
    content = content.replace('text-slate-500', 'text-slate-400')
    content = content.replace('text-[#004ac6]', 'text-blue-400')
    content = content.replace('hover:bg-slate-100', 'hover:bg-white/[0.06]')
    content = content.replace('shadow-2xs', 'shadow-lg shadow-black/20')
    content = content.replace('bg-slate-100', 'bg-slate-700/50')

    # Modal overlays
    content = content.replace('bg-slate-900/60 backdrop-blur-md', 'bg-slate-950/60 backdrop-blur-md')
    
    # regex for main div replacement for both theory and practice
    # Original Theory: className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen font-sans flex flex-col"
    # Since I did string replacements above, it becomes: className=" text-white min-h-screen font-sans flex flex-col"
    content = re.sub(r'<div className="([^"]*min-h-screen[^"]*text-white[^"]*)"\s*>',
                     r'<div className="\1" style={{ background: "linear-gradient(135deg, #070f1e 0%, #0d1b2e 50%, #070f1e 100%)" }}>',
                     content)

    content = re.sub(r'<div className="([^"]*text-white[^"]*min-h-screen[^"]*)"\s*>',
                     r'<div className="\1" style={{ background: "linear-gradient(135deg, #070f1e 0%, #0d1b2e 50%, #070f1e 100%)" }}>',
                     content)

    # Some might not have matched exactly, let's just find the first outer div and add the style if not already present.
    # The regex above should be robust enough for min-h-screen outer divs.

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    process(sys.argv[1], sys.argv[2])
