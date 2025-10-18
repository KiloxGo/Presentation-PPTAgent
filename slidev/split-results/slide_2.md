---
transition: fade-out
---

<style>
.content-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  height: 100%;
  padding: 2rem;
}
.title-section {
  text-align: center;
  margin-bottom: 1.5rem;
}
.title-section h1 {
  font-size: 2.5rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}
.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}
.content-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 1.2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.content-item h3 {
  margin: 0 0 0.8rem 0;
  color: #34495e;
  font-size: 1.3rem;
  font-weight: 600;
}
.content-item ul {
  margin: 0;
  padding-left: 1.2rem;
  line-height: 1.5;
}
.content-item li {
  margin-bottom: 0.6rem;
  font-size: 1.1rem;
}
</style>

<div class="absolute inset-0 -z-1" style="border: 2px solid red; overflow: hidden;">
  <img src="/mid.jpg" style="width: 100%; height: 100%; object-fit: fill;">
</div>

<div class="content-container">
  <div class="title-section">
    <h1>Why PowerPoint for Benchmarking?</h1>
  </div>
  
  <div class="content-grid">
    <div class="content-item">
      <h3>Rich Element Diversity</h3>
      <ul>
        <li>PowerPoint chosen for its diverse elements and broader API support compared to Word and Excel</li>
      </ul>
    </div>
    
  <div class="content-item">
      <h3>Simulated User Interactions</h3>
      <ul>
        <li>PPTC features multi-turn dialogues with varying difficulty</li>
        <li>Simulates real user-LLM interactions</li>
      </ul>
    </div>
    
  <div class="content-item">
      <h3>Session Structure</h3>
      <ul>
        <li>Each session includes 2 to 17 turns</li>
        <li>Instructions derived from actual PowerPoint usage to ensure practicality</li>
      </ul>
    </div>
  </div>
</div>
