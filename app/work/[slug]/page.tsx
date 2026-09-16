import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, projects } from '../../projects';

export function generateStaticParams(){ return projects.map(({slug})=>({slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const project=getProject((await params).slug); if(!project) return {};
  return {title:`${project.title} — Ruiben He`,description:project.intro,openGraph:{title:`${project.title} — Ruiben He`,description:project.intro,images:[]},twitter:{title:`${project.title} — Ruiben He`,description:project.intro,images:[]}};
}

export default async function ProjectPage({params}:{params:Promise<{slug:string}>}){
  const project=getProject((await params).slug); if(!project) notFound();
  const index=projects.findIndex(p=>p.slug===project.slug); const next=projects[(index+1)%projects.length];
  const isEagle=project.slug==='eagle-product-development';
  const isGalleryOnly=project.galleryOnly===true;
  // Skip the requested 03 artwork while keeping the original numbering and
  // letting the former 04 artwork flow into that freed position.
  const galleryImageIndices=isEagle?[0,1,3]:project.slug==='character-resonance'?[0,1,3,4,5]:project.images.map((_,i)=>i);
  const galleryImages=galleryImageIndices.map((i)=>project.images[i]);
  const galleryCaptionIndices=galleryImageIndices;
  return <main className={`detail${isGalleryOnly?' galleryOnlyDetail':''}`} style={{'--project-accent':project.accent} as React.CSSProperties}>
    <nav className="nav"><a className="wordmark" href="/">RUIBEN HE—26</a><div className="navLinks"><a href="/work">作品分布</a><a href="/recognition">荣誉</a><a href="/#about">关于</a></div></nav>
    <header className="detailHero"><p>{project.no} / {project.category}</p><h1>{project.title}</h1><div><h2>{project.cnTitle}</h2><span>{project.year}</span></div></header>
    <figure className={`detailCover detailCover-${project.slug}`}><img src={`/projects/assets/${project.cover}`} style={{objectPosition:project.coverPosition}} alt={`${project.title} 项目封面`}/><figcaption>PROJECT {project.no} / {project.title}</figcaption></figure>
    {isGalleryOnly&&<section className="detailIntro artworkDisplayIntro"><p className="detailLead">{project.intro}</p><div><span>EXHIBITIONS / 展览与时装周</span><p>{project.brief}</p></div></section>}
    {project.exhibitionPhotos&&<section className="exhibitionDetail"><header><span>EXHIBITION DOCUMENTATION / 展览现场</span><h2>From paper<br/>to the gallery.</h2><p>第12页作品集记录的三场伦敦展览现场。每一组陈列都让线描风景从纸面延伸到真实空间，并保留作品之间的观看节奏。</p></header><div className="exhibitionDetailGrid">{project.exhibitionPhotos.map((item)=><figure key={item.src}><img src={`/projects/assets/${item.src}`} alt={item.title}/><figcaption><strong>{item.title}</strong><span>{item.body}</span></figcaption></figure>)}</div></section>}
    {project.pdfIntro&&<section className="pdfIntroPanel"><img src={`/projects/assets/${project.pdfIntro}`} alt={`${project.title} project introduction`} /></section>}
    {!isGalleryOnly&&!project.pdfIntro&&<><section className="detailIntro"><p className="detailLead">{project.intro}</p><div><span>PROJECT BRIEF</span><p>{project.brief}</p></div></section>
    {project.collaboration && <section className="collaborationFlag"><span>COLLABORATION / 合作说明</span><p>{project.collaboration}</p></section>}
    <section className="roleStrip"><span>MY ROLE</span>{project.role.map(role=><b key={role}>{role}</b>)}</section>
    {project.researchQuestion && <section className="researchQuestion"><span>RESEARCH QUESTION / 研究问题</span><h2>{project.researchQuestion}</h2></section>}
    {project.researchSteps && <section className="researchMethod"><header><span>METHODOLOGY / 研究方法</span><h2>From lived space<br/>to visual memory</h2></header><div className="researchSteps">{project.researchSteps.map(step=><article key={step.no}><span>{step.no}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}</div></section>}
    {project.findings && <section className="researchFindings"><header><span>KEY FINDINGS / 核心发现</span><h2>Belonging,<br/>made visible.</h2></header><div>{project.findings.map(item=><article key={item.value+item.label}><strong>{item.value}</strong><p>{item.label}</p></article>)}</div></section>}</>}
    <header className={`galleryHead${isGalleryOnly?' galleryOnlyHead':''}`}><span>{isGalleryOnly?'ARTWORK DISPLAY / 作品陈列':'SELECTED STORY / 精选叙事'}</span><h2>{isGalleryOnly?'Only the work.':project.slug==='childhood'?'Illustration → Installation → Experience':project.slug==='character-resonance'?'Research → Play → Resonance':project.slug==='xingying-travel-ip'?'Title → ICON → Application':project.slug==='feng-shui-vr'?'Interview → VR → Illustration':project.slug==='ark-flickering-candles'?'Heritage → Ritual → Prototype':project.slug==='eagle-product-development'?'Research → Product → Campaign':'Process → Outcome'}</h2>{!isGalleryOnly&&<p>{project.slug==='childhood'?'只呈现完整插画成果、装置效果与观众互动现场，让最终体验成为项目叙事的中心。':project.slug==='character-resonance'?'从用户对简繁体字的真实态度出发，通过双人对弈、单人操作与灯光反馈场景，呈现字符如何在移动中共同生成声音与视觉节奏。':project.slug==='xingying-travel-ip'?'从定制标题与目的地 ICON 出发，延展至壁纸、数字界面、专题页面和真实旅行场景，呈现行影 IP 的完整品牌系统。':project.slug==='feng-shui-vr'?'从参与者的真实居住经验开始，经由空间建模与双版本 VR 测试，最终转译为关于“家”的黑白视觉叙事。':project.slug==='ark-flickering-candles'?'从灯文化和大报恩寺历史研究出发，呈现团队如何建立参与式仪式、手持灯原型与公共空间光影系统。':project.slug==='eagle-product-development'?'以市场数据和渠道观察为起点，重点展示便利贴产品系列及其在展会海报和传播视觉中的落地。':'A curated view of the project development.'}</p>}</header>
    <section className={`gallery gallery-${project.slug}`}>{galleryImages.map((src,i)=><figure key={src} className={isGalleryOnly?'galleryOnlyWork':project.slug==='feng-shui-vr'&&src===project.video?'wide vrVideo':project.slug==='ark-flickering-candles'&&src==='ark-title-candles.png'?'wide arkTitleVisual':project.slug==='ark-flickering-candles'&&src.startsWith('ark-user-')?'wide arkUserRender':project.slug==='ark-flickering-candles'&&src==='ark-exhibition-light-columns.png'?'wide arkExhibitionPhoto':i%3===0?'wide':''}>{project.slug==='xingying-travel-ip'&&i>=6&&<img className="galleryBackdrop" src={`/projects/assets/${src}`} alt="" aria-hidden="true"/>}{project.slug==='feng-shui-vr'&&src===project.video?<video src={`/projects/assets/${src}`} controls playsInline preload="metadata" poster="/projects/assets/feng-shui-vr-showcase-cover.png"/>:<img src={`/projects/assets/${src}`} alt={`${project.title} project visual ${i+1}`}/>} {!isGalleryOnly&&<figcaption>{project.captions?.[galleryCaptionIndices[i]] ?? `${String(galleryCaptionIndices[i]+1).padStart(2,'0')} / ${project.title}`}</figcaption>}</figure>)}</section>
    {isEagle&&<><header className="eaglePosterHead"><span>ALL CAMPAIGN POSTERS / 全部海报</span><h2>Campaign<br/>Poster Wall</h2><p>按广交会倒计时与产品主题整理，满幅连续拼接展示；页面不留白，必要处做轻微裁切。</p></header><section className="eaglePosterWall">{project.images.slice(4).map((src,i)=><figure key={src}><img src={`/projects/assets/${src}`} alt={`${project.title} campaign poster ${i+1}`}/><figcaption>{project.captions?.[i+4]}</figcaption></figure>)}</section></>}
    <a className="nextProject" href={`/work/${next.slug}`}><span>下一个项目 / NEXT</span><strong>{next.title} ↗</strong></a>
  </main>;
}
