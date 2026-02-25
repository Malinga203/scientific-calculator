import { create, all } from "mathjs";

const math = create(all);

math.import(
  {
    sin: (x) => Math.sin((x * Math.PI) / 180),
    cos: (x) => Math.cos((x * Math.PI) / 180),
    tan: (x) => Math.tan((x * Math.PI) / 180),

    // helpers
    log: (x) => Math.log10(x), 
    ln: (x) => Math.log(x),   
  },
  { override: true }
);

export default math;