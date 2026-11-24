/* Original teaching model: ideal two-link arm, angles in degrees. */
(function (root) {
  function forward(l1,l2,q1,q2) {
    const a=q1*Math.PI/180,b=(q1+q2)*Math.PI/180;
    return {elbow:[l1*Math.cos(a),l1*Math.sin(a)],tip:[l1*Math.cos(a)+l2*Math.cos(b),l1*Math.sin(a)+l2*Math.sin(b)]};
  }
  if(typeof module!=='undefined') module.exports={forward};
  if(typeof document==='undefined') return;
  const $=id=>document.getElementById(id);
  function draw() {
    const q1=Number($('q1').value),q2=Number($('q2').value),p=forward(1,1,q1,q2);
    $('q1-value').textContent=q1+'°';$('q2-value').textContent=q2+'°';
    const map=([x,y])=>[210+x*80,210-y*80];
    const e=map(p.elbow),t=map(p.tip),target=map([Number($('tx').value),Number($('ty').value)]);
    $('arm-links').setAttribute('points',[[210,210],e,t].map(v=>v.join(',')).join(' '));
    $('elbow').setAttribute('cx',e[0]);$('elbow').setAttribute('cy',e[1]);$('tip').setAttribute('cx',t[0]);$('tip').setAttribute('cy',t[1]);
    $('target').setAttribute('cx',target[0]);$('target').setAttribute('cy',target[1]);
    $('position').textContent='x = '+p.tip[0].toFixed(3)+' m, y = '+p.tip[1].toFixed(3)+' m';
    const error=Math.hypot(p.tip[0]-Number($('tx').value),p.tip[1]-Number($('ty').value));
    $('error').textContent='Distance to target: '+error.toFixed(3)+' m. '+(error<.025?'Target reached within 0.025 m.':'Adjust the angles to approach the target.');
  }
  ['q1','q2','tx','ty'].forEach(id=>$(id).addEventListener('input',draw));
  document.querySelectorAll('[data-pose]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.pose.split(',');$('q1').value=a[0];$('q2').value=a[1];draw();}));
  $('download-results').addEventListener('click',()=>{
    const p=forward(1,1,Number($('q1').value),Number($('q2').value));
    const text='l1_m,l2_m,q1_deg,q2_relative_deg,x_m,y_m,target_x_m,target_y_m\n1,1,'+[$('q1').value,$('q2').value,...p.tip,$('tx').value,$('ty').value].join(',')+'\n';
    const url=URL.createObjectURL(new Blob([text],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='planar-arm-result.csv';a.click();URL.revokeObjectURL(url);
  });
  draw();
})(typeof window==='undefined'?globalThis:window);
