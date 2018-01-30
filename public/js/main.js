(function() {
  var MAX_GLYPHS, camera, canvas, cfg, cfg_controls, color_names, colors, colors_h, create_landscape, default_cfg, dirty, engine, generate_glyphs, generate_glyphs_txt, generate_logo, generate_particles, generate_particles_scene, generate_title, gui, h_aligns, init, init_gui, ngon, render_png, scene, v_aligns;

  color_names = ["Digi_Violet", "Lemon", "Black", "White", "Rose", "Graphite"];

  colors_h = {
    Digi_Violet: "#7D25FB",
    Lemon: "#FDF56C",
    Black: "#000000",
    White: "#FFFFFF",
    Rose: "#FFA9BE",
    Graphite: "#1C1B21"
  };

  colors = {
    Digi_Violet: new BABYLON.Color3(0x7D / 255.0, 0x25 / 255.0, 0xFB / 255.0),
    Lemon: new BABYLON.Color3(0xFD / 255.0, 0xF5 / 255.0, 0x6C / 255.0),
    Black: new BABYLON.Color3(0x00 / 255.0, 0x00 / 255.0, 0x00 / 255.0),
    White: new BABYLON.Color3(0xFF / 255.0, 0xFF / 255.0, 0xFF / 255.0),
    Rose: new BABYLON.Color3(0xFF / 255.0, 0xA9 / 255.0, 0xBE / 255.0),
    Graphite: new BABYLON.Color3(0x1C / 255.0, 0x1B / 255.0, 0x21 / 255.0)
  };

  h_aligns = {
    center: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
    left: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    right: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
  };

  v_aligns = {
    center: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
    top: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
    bottom: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
  };

  default_cfg = function() {
    return {
      scale: 1,
      scene: {
        "background": true,
        "background color": "Digi_Violet"
      },
      landscape: true,
      landscape_settings: {
        "seed": 0,
        "rotation y": 2.15,
        "rotation x": -0.33,
        "x": -4.0,
        "y": 2.3,
        "z": -2.0,
        "height": 1.0,
        "scale": 1.0,
        "width": 1.0,
        "height": 1.0,
        "h1": 2.0,
        "h2": -2.0,
        "h3": 0.0,
        "h4": 0.0
      },
      "landscape glp": true,
      landscape_glyph_settings: {
        seed: 0,
        count: 50,
        min: 0.5,
        max: 1.5
      },
      "scene glp": true,
      scene_glyph_settings: {
        seed: 0,
        count: 20,
        min: 0.5,
        max: 1.5
      },
      title: true,
      title_settings: {
        text: "AUTOMATE YOUR SUCCESS",
        x: 1.5,
        y: 0.0
      },
      logo: true,
      logo_settings: {
        "color": "White",
        "h align": "left",
        "v align": "top",
        "padding": 0
      }
    };
  };

  cfg = JSON.parse(typeof localStorage !== "undefined" && localStorage !== null ? localStorage.getItem("cfg") : void 0);

  if (cfg == null) {
    cfg = default_cfg();
  }

  cfg_controls = {
    save: function() {
      return localStorage.setItem("cfg", JSON.stringify(cfg));
    },
    reset: function() {
      cfg = default_cfg();
      cfg_controls.save();
      return location.reload();
    }
  };

  MAX_GLYPHS = 300;

  canvas = engine = scene = camera = gui = void 0;

  dirty = true;

  create_landscape = function(scene) {
    var generate_paths, landscape, landscape_mat, landscape_shader, landscape_txt, paths, paths_t;
    landscape_shader = {
      attributes: ["position", "normal", "uv"],
      uniforms: ["world", "worldView", "worldViewProjection", "view", "projection", "time", "direction"]
    };
    landscape_mat = new BABYLON.ShaderMaterial("landscape", scene, "./landscape", landscape_shader);
    landscape_mat.backFaceCulling = false;
    landscape_txt = new BABYLON.Texture("landscape_2.png", scene);
    landscape_mat.setTexture("textureSampler", landscape_txt);
    generate_paths = function(seed) {
      var dx1, dx2, dx3, dx4, dx5, dy1, dy2, dy3, dy4, dy5, h, ls, path, paths, rnd, step, x, y, z, _i, _j;
      if (seed == null) {
        seed = 0;
      }
      ls = cfg.landscape_settings;
      if (typeof Math.seedrandom === "function") {
        Math.seedrandom(seed);
      }
      h = function(x, y, dx, dy) {
        var s;
        if (dx == null) {
          dx = 0;
        }
        if (dy == null) {
          dy = 0;
        }
        s = (x + dx) * (x + dx) + (y + dy) * (y + dy);
        return Math.cos(s) / (1 + s);
      };
      rnd = function() {
        return Math.random() - Math.random();
      };
      step = 0.02;
      dx1 = rnd() * 4.0;
      dy1 = rnd() * 4.0;
      dx2 = rnd() * 4.0;
      dy2 = rnd() * 4.0;
      dx3 = rnd() * 4.0;
      dy3 = rnd() * 4.0;
      dx4 = rnd() * 4.0;
      dy4 = rnd() * 4.0;
      dx5 = rnd() * 5.0;
      dy5 = rnd() * 5.0;
      paths = [];
      for (x = _i = -4; _i <= 4; x = _i += step) {
        path = [];
        for (y = _j = -4; _j <= 4; y = _j += step) {
          z = h(x, y, dx1, dy1) * ls.h1 + h(x, y, dx2, dy2) * ls.h2 + h(x, y, dx3, dy3) * ls.h3 + h(x, y, dx4, dy4) * ls.h4 + Math.sin(x * 2 + dx5) / 4 - Math.cos(y * 4 + dy5) / 6;
          path.push(new BABYLON.Vector3(x, z, y));
        }
        paths.push(path);
      }
      return paths;
    };
    paths = generate_paths();
    paths_t = generate_paths();
    landscape = new BABYLON.Mesh.CreateRibbon("ribbon", paths, false, false, null, scene, true);
    landscape.material = landscape_mat;
    landscape.rebuild = function() {
      paths = generate_paths(cfg.landscape_settings.seed);
      BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, landscape);
      return dirty = true;
    };
    landscape.parent = BABYLON.Mesh.CreateBox("landscape parent", 4.0, scene);
    landscape.parent.isVisible = false;
    landscape.update = function() {
      landscape.isVisible = cfg.landscape;
      landscape.rotation.y = cfg.landscape_settings["rotation y"];
      landscape.scaling.y = cfg.landscape_settings["height"];
      landscape.parent.rotation.x = cfg.landscape_settings["rotation x"];
      landscape.parent.position.x = cfg.landscape_settings["x"];
      landscape.parent.position.y = cfg.landscape_settings["y"];
      landscape.parent.position.z = cfg.landscape_settings["z"];
      landscape.parent.scaling.x = landscape.parent.scaling.y = landscape.parent.scaling.z = cfg.landscape_settings["scale"];
      return dirty = true;
    };
    landscape.update();
    return landscape;
  };

  generate_particles = function(scene, landscape, img) {
    var particles;
    particles = new BABYLON.ParticleSystem("particles", 50, scene);
    particles.particleTexture = new BABYLON.Texture(img, scene);
    particles.emitter = landscape;
    particles.minEmitBox = new BABYLON.Vector3(-4, 0, -4);
    particles.maxEmitBox = new BABYLON.Vector3(4, 0, 4);
    particles.color1 = colors.White;
    particles.color2 = colors.Lemon;
    particles.colorDead = colors.Black;
    particles.minSize = 0.05;
    particles.maxSize = 0.10;
    particles.minLifeTime = 0.3;
    particles.maxLifeTime = 1.5;
    particles.emitRate = 10;
    particles.gravity = new BABYLON.Vector3(0, -5, 0);
    particles.direction1 = new BABYLON.Vector3(0, 5, 0);
    particles.direction2 = new BABYLON.Vector3(0, 5, 0);
    particles.minEmitPower = 0.5;
    particles.maxEmitPower = 1.0;
    particles.updateSpeed = 0.005;
    return particles.start();
  };

  generate_particles_scene = function(scene, landscape, img) {
    var particles;
    particles = new BABYLON.ParticleSystem("particles", 50, scene);
    particles.particleTexture = new BABYLON.Texture(img, scene);
    particles.emitter = landscape;
    particles.minEmitBox = new BABYLON.Vector3(-8, -4, -8);
    particles.maxEmitBox = new BABYLON.Vector3(8, 4, 8);
    particles.color1 = colors.White;
    particles.color2 = colors.Lemon;
    particles.colorDead = colors.Black;
    particles.minSize = 0.1;
    particles.maxSize = 0.5;
    particles.minLifeTime = 1.0;
    particles.maxLifeTime = 2.5;
    particles.emitRate = 4;
    particles.gravity = new BABYLON.Vector3(0, -1, 0);
    particles.direction1 = new BABYLON.Vector3(0, 1, 0);
    particles.direction2 = new BABYLON.Vector3(0, 1, 0);
    particles.minEmitPower = 0.5;
    particles.maxEmitPower = 1.0;
    particles.updateSpeed = 0.005;
    return particles.start();
  };

  ngon = function(ctx, x, y, r, n) {
    var a, i, _i;
    ctx.beginPath(x + r, y);
    for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
      a = Math.PI * 2 / n;
      ctx.lineTo(x + r * Math.sin(a * i), x + r * Math.cos(a * i));
    }
    return ctx.closePath();
  };

  generate_glyphs_txt = function(scene, size) {
    var c, ctx, n, r, s2, sides, txt, x, y, _i, _j;
    sides = [0, 1, 3, 4, 6, 32];
    txt = new BABYLON.DynamicTexture("glyphs texture", size * 8, scene, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    ctx = txt.getContext();
    s2 = size / 2.0;
    ctx.save();
    for (y = _i = 0; _i < 7; y = ++_i) {
      ctx.save();
      for (x = _j = 0; _j < 7; x = ++_j) {
        r = size / 3.0;
        c = colors[color_names[Math.random() * color_names.length | 0]];
        ctx.fillStyle = "rgba(" + (c.r * 255) + ", " + (c.g * 255) + ", " + (c.b * 255) + ", 0.001)";
        ctx.fillRect(0, 0, size, size);
        n = sides[(x * y) % sides.length];
        switch (n) {
          case 0:
            ctx.beginPath();
            ctx.moveTo(s2 - r, s2 - r);
            ctx.lineTo(s2 + r, s2 + r);
            ctx.moveTo(s2 + r, s2 - r);
            ctx.lineTo(s2 - r, s2 + r);
            ctx.closePath();
            break;
          case 1:
            ctx.beginPath();
            ctx.moveTo(s2, s2 - r);
            ctx.lineTo(s2, s2 + r);
            ctx.moveTo(s2 + r, s2);
            ctx.lineTo(s2 - r, s2);
            ctx.closePath();
            break;
          default:
            ngon(ctx, s2, s2, r, n);
        }
        ctx.strokeStyle = "rgba(" + (c.r * 255) + ", " + (c.g * 255) + ", " + (c.b * 255) + ", 0.95)";
        ctx.lineWidth = 4 + Math.random() * 5;
        ctx.stroke();
        ctx.translate(size, 0);
      }
      ctx.restore();
      ctx.translate(0, size);
    }
    ctx.restore();
    txt.update();
    return txt;
  };

  generate_glyphs = function(scene, parent, count) {
    var du, dv, glyph, glyph_size, glyphs_mat, glyphs_txt, i, params, root, step, uvs, _i, _j, _ref;
    root = new BABYLON.MeshBuilder.CreateBox("glyphs root", 0.1);
    if (parent != null) {
      root.parent = parent;
    }
    root.isVisible = false;
    glyph_size = 128;
    glyphs_mat = new BABYLON.StandardMaterial("glyphs material", scene, true);
    glyphs_txt = generate_glyphs_txt(scene, glyph_size);
    glyphs_mat.opacityTexture = glyphs_txt;
    glyphs_mat.emissiveTexture = glyphs_txt;
    glyphs_mat.alphaMode = BABYLON.Engine.ALPHA_COMBINE;
    root.glyphs = [];
    params = {
      width: 0.25,
      height: 0.25,
      updatable: true
    };
    for (i = _i = 0; 0 <= MAX_GLYPHS ? _i < MAX_GLYPHS : _i > MAX_GLYPHS; i = 0 <= MAX_GLYPHS ? ++_i : --_i) {
      glyph = new BABYLON.MeshBuilder.CreatePlane("glyph", params, scene);
      if (i > count) {
        glyph.isVisible = false;
      }
      glyph.material = glyphs_mat;
      glyph.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
      glyph.parent = root;
      uvs = glyph.getVerticesData(BABYLON.VertexBuffer.UVKind);
      step = 1.0 / 8.0;
      du = (Math.random() * 8 | 0) * step;
      dv = (Math.random() * 8 | 0) * step;
      for (i = _j = 0, _ref = uvs.length; _j < _ref; i = _j += 2) {
        uvs[i + 0] = du + uvs[i + 0] * step;
        uvs[i + 1] = dv + uvs[i + 1] * step;
      }
      glyph.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
      glyph.renderingGroupId = 3;
      root.glyphs.push(glyph);
    }
    root.update_glyphs_pos = function(cfg) {
      var s, _k, _len, _ref1;
      Math.seedrandom(cfg.seed);
      _ref1 = root.glyphs;
      for (i = _k = 0, _len = _ref1.length; _k < _len; i = ++_k) {
        glyph = _ref1[i];
        s = cfg.min + Math.random() * (cfg.max - cfg.min);
        glyph.scaling.x = s;
        glyph.scaling.y = s;
        glyph.position.x = (Math.random() - 0.5) * 8.0;
        glyph.position.y = Math.random() * 1.0;
        glyph.position.z = (Math.random() - 0.5) * 8.0;
        glyph.isVisible = i < cfg.count;
      }
      return dirty = true;
    };
    root.visibility = function(cfg, value) {
      var _k, _len, _ref1;
      _ref1 = root.glyphs;
      for (i = _k = 0, _len = _ref1.length; _k < _len; i = ++_k) {
        glyph = _ref1[i];
        if (i < cfg.count) {
          glyph.isVisible = value;
        }
      }
      return dirty = true;
    };
    return root;
  };

  generate_logo = function() {
    var advanced_txt, logo, ls;
    ls = cfg.logo_settings;
    advanced_txt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    logo = new BABYLON.GUI.Image("logo", "logo_" + ls.color + ".png");
    advanced_txt.addControl(logo);
    logo.autoScale = true;
    logo.horizontalAlignment = h_aligns[ls["h align"]];
    logo.verticalAlignment = v_aligns[ls["v align"]];
    logo.isVisible = cfg.logo;
    return logo;
  };

  generate_title = function(scene, camera) {
    var mat, params, root, title, txt;
    txt = new BABYLON.DynamicTexture("title texture", 2048, scene, false, BABYLON.Texture.BILINEAR_SAMPLINGMODE);
    txt.hasAlpha = true;
    mat = new BABYLON.StandardMaterial("material", scene, true);
    mat.opacityTexture = txt;
    mat.emissiveTexture = txt;
    mat.alphaMode = BABYLON.Engine.ALPHA_ADD;
    root = new BABYLON.MeshBuilder.CreateBox("title root", 0.1);
    root.isVisible = false;
    params = {
      width: 5.0,
      height: 5.0,
      updatable: true
    };
    root.position.z = -5.0;
    root.title = title = new BABYLON.MeshBuilder.CreatePlane("title", params, scene);
    title.material = mat;
    title.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    title.parent = root;
    title.alphaIndex = 0;
    title.renderingGroupId = 2;
    root.update = function(text) {
      var ctx, i, size, t, _i, _len, _ref;
      ctx = txt.getContext();
      ctx.clearRect(0, 0, 2048, 2048);
      ctx.fillStyle = '#fff';
      ctx.textBaseline = 'top';
      size = 240;
      ctx.font = "900 " + size + "px Roboto";
      _ref = text.split(" ");
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        t = _ref[i];
        ctx.fillText(t, 0, i * size);
      }
      txt.update();
      return dirty = true;
    };
    title.isVisible = cfg.title;
    root.position.x = cfg.title_settings.x;
    root.position.y = cfg.title_settings.y;
    return root;
  };

  render_png = function(render) {
    var on_success;
    on_success = function(data) {
      console.log("Render complete, image size: " + data.length);
      return download(data, "render.png", "image/png");
    };
    return BABYLON.Tools.CreateScreenshotUsingRenderTarget(engine, camera, {
      wdith: render.width,
      height: render.width
    }, on_success, 1);
  };

  init = function() {
    canvas = $('#canvas')[0];
    engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true
    });
    scene = new BABYLON.Scene(engine);
    scene.clearColor = colors[cfg.scene["background color"]];
    camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI / 2.0, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    init_gui();
    engine.runRenderLoop(function() {
      if (dirty) {
        console.log("render");
        scene.render();
      }
      return dirty = false;
    });
    window.addEventListener('resize', function() {
      engine.resize();
      return dirty = true;
    });
    return setInterval(((function(_this) {
      return function() {
        return dirty = true;
      };
    })(this)), 2000);
  };

  init_gui = function() {
    var f, landscape, landscape_glyphs, lgs, logo, ls, scene_glyphs, sgs, title, ts, update_background;
    gui = new dat.GUI;
    gui.add(cfg, "scale", 0.1, 4.0).onFinishChange(function(val) {
      engine.setHardwareScalingLevel(1.0 / val);
      return dirty = true;
    });
    update_background = function() {
      scene.clearColor = cfg.scene.background && colors[cfg.scene["background color"]] || new BABYLON.Color4(0, 0, 0, 0.00000000001);
      return dirty = true;
    };
    update_background();
    gui.add(cfg.scene, "background").onChange(function() {
      return update_background();
    });
    gui.add(cfg.scene, "background color", color_names).onFinishChange(function() {
      return update_background();
    });
    title = generate_title(scene);
    gui.add(cfg, "title").onChange(function(val) {
      title.title.isVisible = val;
      return dirty = true;
    });
    f = gui.addFolder("title settings");
    ts = cfg.title_settings;
    title.update(ts.text);
    title.position.x = 1.5;
    f.add(ts, "x", -4.0, 4.0, 0.1).onChange(function(val) {
      title.position.x = val;
      return dirty = true;
    });
    f.add(ts, "y", -4.0, 4.0, 0.1).onChange(function(val) {
      title.position.y = val;
      return dirty = true;
    });
    f.add(ts, "text").onChange(function(txt) {
      return title.update(txt);
    });
    landscape = create_landscape(scene);
    gui.add(cfg, "landscape").onChange(function(val) {
      landscape.isVisible = val;
      return dirty = true;
    });
    f = gui.addFolder("landscape settings");
    ls = cfg.landscape_settings;
    f.add(ls, "seed", 0, 10000).onChange(function(val) {
      return landscape.rebuild();
    });
    f.add(ls, "height", 0.01, 4, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "rotation y", -Math.PI, Math.PI, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "rotation x", -Math.PI, Math.PI, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "x", -4, 4, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "y", -4, 4, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "z", -4, 4, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "scale", 0.25, 4, 0.01).onChange(function(val) {
      return landscape.update();
    });
    f.add(ls, "h1", -3.0, 3.0, 0.01).onChange(function(val) {
      return landscape.rebuild();
    });
    f.add(ls, "h2", -3.0, 3.0, 0.01).onChange(function(val) {
      return landscape.rebuild();
    });
    f.add(ls, "h3", -3.0, 3.0, 0.01).onChange(function(val) {
      return landscape.rebuild();
    });
    f.add(ls, "h4", -3.0, 3.0, 0.01).onChange(function(val) {
      return landscape.rebuild();
    });
    landscape_glyphs = generate_glyphs(scene, landscape, cfg.landscape_glyph_settings.count);
    lgs = cfg.landscape_glyph_settings;
    landscape_glyphs.update_glyphs_pos(lgs);
    landscape_glyphs.visibility(lgs, cfg["landscape glp"]);
    gui.add(cfg, "landscape glp").onChange(function(val) {
      landscape_glyphs.visibility(lgs, val);
      return dirty = true;
    });
    f = gui.addFolder("landscape glyph settings");
    f.add(lgs, "seed", 0, 1000, 1).onChange(function(val) {
      return landscape_glyphs.update_glyphs_pos(lgs);
    });
    f.add(lgs, "count", 0, MAX_GLYPHS, 1).onChange(function(val) {
      return landscape_glyphs.update_glyphs_pos(lgs);
    });
    f.add(lgs, "min", 0.1, 3.0, 0.01).onChange(function(val) {
      return landscape_glyphs.update_glyphs_pos(lgs);
    });
    f.add(lgs, "max", 0.1, 3.0, 0.01).onChange(function(val) {
      return landscape_glyphs.update_glyphs_pos(lgs);
    });
    scene_glyphs = generate_glyphs(scene, null, 10);
    scene_glyphs.rotation.x = Math.PI / 2;
    scene_glyphs.position.z = -2.0;
    sgs = cfg.scene_glyph_settings;
    scene_glyphs.update_glyphs_pos(sgs);
    scene_glyphs.visibility(sgs, cfg["scene glp"]);
    scene_glyphs.scaling.x = 4.0;
    gui.add(cfg, "scene glp").onChange(function(val) {
      scene_glyphs.visibility(sgs, val);
      return dirty = true;
    });
    f = gui.addFolder("scene glyph settings");
    f.add(sgs, "seed", 0, 1000, 1).onChange(function(val) {
      return scene_glyphs.update_glyphs_pos(sgs);
    });
    f.add(sgs, "count", 0, MAX_GLYPHS, 1).onChange(function(val) {
      return scene_glyphs.update_glyphs_pos(sgs);
    });
    f.add(sgs, "min", 0.1, 3.0, 0.01).onChange(function(val) {
      return scene_glyphs.update_glyphs_pos(sgs);
    });
    f.add(sgs, "max", 0.1, 3.0, 0.01).onChange(function(val) {
      return scene_glyphs.update_glyphs_pos(sgs);
    });
    ls = cfg.logo_settings;
    logo = generate_logo();
    gui.add(cfg, "logo").onChange(function(val) {
      logo.isVisible = val;
      return dirty = true;
    });
    f = gui.addFolder("logo settings");
    f.add(ls, "color", color_names).onChange(function(val) {
      logo.source = "logo_" + val + ".png";
      return dirty = true;
    });
    f.add(ls, "h align", ["left", "center", "right"]).onChange(function(val) {
      logo.horizontalAlignment = h_aligns[val];
      return dirty = true;
    });
    f.add(ls, "v align", ["top", "center", "bottom"]).onChange(function(val) {
      logo.verticalAlignment = v_aligns[val];
      return dirty = true;
    });
    gui.add(cfg_controls, "save");
    gui.add(cfg_controls, "reset");
    return dirty = true;
  };

  $(function() {
    console.log("START");
    return WebFont.load({
      google: {
        families: ['Roboto', 'Roboto:900']
      },
      active: init
    });
  });

}).call(this);
