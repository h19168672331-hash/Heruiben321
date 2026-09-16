import { awards, exhibitions } from '../recognition';

export const metadata={title:'奖项与展览 — Ruiben He',description:'Ruiben He 的设计奖项、艺术展览与跨界呈现。'};

export default function Recognition(){return <main className="recognitionPage">
  <nav className="nav"><a className="wordmark" href="/">RUIBEN HE—26</a><div className="navLinks"><a href="/work">作品</a><a href="/recognition">荣誉</a><a href="/#about">关于</a></div></nav>
  <header className="recognitionHero"><span>AWARDS · EXHIBITIONS · PRESS</span><h1>Recognition<br/><em>& Moments</em></h1><p>奖项、展览与跨界现场<br/>2022—2026</p></header>
  <section className="recognitionFeature"><span>FEATURED RECOGNITION · 2026</span><div><p>BEST GLOBAL<br/>APPEAL PRIZE</p><h2>全球最佳<br/><em>吸引力奖</em></h2></div><footer><b>2026 永不消失的遗产全球创客大赛</b><span>GLOBAL · HERITAGE · MAKER</span></footer></section>
  <section className="recognitionSection"><div className="recognitionTitle"><span>01</span><h2>Awards<br/><em>获奖记录</em></h2><b>{awards.length.toString().padStart(2,'0')}</b></div><div className="recognitionList">{awards.map((item,i)=><article key={`${item.title}-${i}`}><span>{item.year}</span><h3>{item.title}</h3><p>{item.scope}</p><strong>{item.result}</strong></article>)}</div></section>
  <section className="recognitionSection dark"><div className="recognitionTitle"><span>02</span><h2>Exhibitions<br/><em>展览现场</em></h2><b>{exhibitions.length.toString().padStart(2,'0')}</b></div><div className="recognitionList">{exhibitions.map((item,i)=><article key={`${item.title}-${i}`}><span>{item.year}</span><h3>{item.title}</h3><p>{item.venue}</p><strong>↗</strong></article>)}</div></section>
  <a className="archiveBack" href="/work">继续看作品 →</a>
 </main>}
