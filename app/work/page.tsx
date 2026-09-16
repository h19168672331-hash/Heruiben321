import { groups, projects } from '../projects';

export const metadata = { title:'作品档案 — Ruiben He', description:'Ruiben He 的交互、体验、产品与空间设计项目。' };

export default function WorkIndex(){return <main className="archivePage">
  <nav className="nav"><a className="wordmark" href="/">RUIBEN HE—26</a><div className="navLinks"><a href="/work">作品分布</a><a href="/recognition">荣誉</a><a href="/#about">关于</a></div></nav>
  <header className="archiveHero"><span>WORK INDEX / 作品分布</span><h1>Selected<br/><em>Projects</em></h1><p>{String(projects.length).padStart(2,'0')} projects · 04 disciplines<br/>2025—2026</p></header>
  <div className="archiveJump">{groups.map(group=><a href={`#${group.slug}`} key={group.slug}><span>{group.no}</span>{group.cnTitle} ↘</a>)}</div>
  {groups.map(group=><section className="archiveGroup" id={group.slug} key={group.slug}>
    <header><span>{group.no}</span><div><h2>{group.title}</h2><p>{group.cnTitle} · {group.description}</p></div><strong>{projects.filter(p=>p.group===group.slug).length.toString().padStart(2,'0')}</strong></header>
    <div className="workGrid">{projects.filter(p=>p.group===group.slug).map(project=><a href={`/work/${project.slug}`} className="workCard" key={project.slug}>
      <div className="workCardImage"><img src={`/projects/assets/${project.cover}`} style={{objectPosition:project.coverPosition}} alt={`${project.title} 项目封面`}/><span style={{background:project.accent}}>{project.no}</span></div>
      <div className="workCardText"><h3>{project.title}<small>{project.cnTitle}</small></h3><p>{project.category}</p><span>VIEW PROJECT ↗</span></div>
    </a>)}</div>
  </section>)}
  <a className="archiveBack" href="/">← 返回首页 / HOME</a>
 </main>}
