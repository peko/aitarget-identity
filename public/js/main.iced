
color_names = [
    "Digi_Violet"
    "Lemon"
    "Black"
    "White"
    "Rose"
    "Graphite"]

colors_h = 
    Digi_Violet  : "#7D25FB"
    Lemon        : "#FDF56C"
    Black        : "#000000"
    White        : "#FFFFFF"
    Rose         : "#FFA9BE"
    Graphite     : "#1C1B21"

colors = 
    Digi_Violet  : new BABYLON.Color3(0x7D/255.0, 0x25/255.0, 0xFB/255.0) # "#7D25FB"
    Lemon        : new BABYLON.Color3(0xFD/255.0, 0xF5/255.0, 0x6C/255.0) # "#FDF56C"
    Black        : new BABYLON.Color3(0x00/255.0, 0x00/255.0, 0x00/255.0) # "#000000"
    White        : new BABYLON.Color3(0xFF/255.0, 0xFF/255.0, 0xFF/255.0) # "#FFFFFF"
    Rose         : new BABYLON.Color3(0xFF/255.0, 0xA9/255.0, 0xBE/255.0) # "#FFA9BE"
    Graphite     : new BABYLON.Color3(0x1C/255.0, 0x1B/255.0, 0x21/255.0) # "#1C1B21"

#  STARTUP CONFIG
cfg = 
    scene:
        background: "Digi_Violet"
        glyphs:
            seed:   0
            count: 20

    landscape:
        "seed"      : 0
        "rotation y": 2.15
        "rotation x":-0.33

        "x"         :-4.0
        "y"         : 2.3
        "z"         :-2.0
        "height"    : 1.0
        "scale"     : 1.0
        
        "width" : 1.0
        "height": 1.0
        glyphs:
            seed :  0
            count: 50

    logo: 
        "color"  : "White" 
        "h align": "left"
        "v align": "top"
        "padding": 0
    

create_landscape = (scene)-> 
    landscape_shader = 
        attributes: [
            "position"
            "normal"
            "uv"],
        uniforms: [ 
            "world" 
            "worldView" 
            "worldViewProjection"
            "view"
            "projection"
            "time"
            "direction"]

    landscape_mat = new BABYLON.ShaderMaterial("landscape", scene, "./landscape", landscape_shader)
    landscape_mat.backFaceCulling = false
    landscape_txt = new BABYLON.Texture("landscape_2.png", scene);
    landscape_mat.setTexture("textureSampler", landscape_txt);

    # normal_mat = new BABYLON.NormalMaterial("normal", scene, false);
    # normal_mat.backFaceCulling = false

    generate_paths  =(seed=0)->
        Math.seedrandom?(seed)

        h = (x,y,dx=0,dy=0)->
            s = (x+dx)*(x+dx)+(y+dy)*(y+dy)
            Math.cos(s)/(1+s)
        rnd = ->Math.random()-Math.random()

        step = 0.1
        dx1 = rnd()*4.0
        dy1 = rnd()*4.0
        dx2 = rnd()*4.0
        dy2 = rnd()*4.0
        dx3 = rnd()*5.0
        dy3 = rnd()*5.0
        paths = []            
        for x in [-4..4] by step
            path = []
            for y in [-4..4] by step
                z = h(  x,  y, dx1, dy1)*2 -
                    h(  x,  y, dx2, dy2)*2 +
                    Math.sin(x*2+dx3)/4 - Math.cos(y*4+dy3)/6

                path.push new BABYLON.Vector3(x,z,y)
            paths.push path
        paths

    paths = generate_paths()
    paths_t = generate_paths()  
    landscape = new BABYLON.Mesh.CreateRibbon("ribbon", paths, false, false, null, scene,true);
    landscape.material = landscape_mat;
    
    #  morphing
    # scene.registerBeforeRender ->
    #     if Math.random() > 0.99
    #         paths_t = generate_paths()            
    #     for path, i in paths
    #         for v, j in path
    #             paths[i][j].y+= (paths_t[i][j].y-paths[i][j].y)/50.0
    #     landscape = BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, landscape);
    
    landscape.rebuild = (seed)->
        paths = generate_paths seed
        BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, landscape);
    
    landscape.parent = BABYLON.Mesh.CreateBox "landscape parent", 4.0, scene 
    landscape.parent.isVisible = false

    landscape

generate_particles = (scene, landscape, img)->
    particles = new BABYLON.ParticleSystem("particles", 50, scene);
    particles.particleTexture = new BABYLON.Texture(img, scene);
    particles.emitter = landscape
    particles.minEmitBox = new BABYLON.Vector3(-4, 0,-4)
    particles.maxEmitBox = new BABYLON.Vector3( 4, 0, 4)
    # // Colors of all particles
    particles.color1 = colors.White
    particles.color2 = colors.Lemon
    particles.colorDead = colors.Black
    # // Size of each particle (random between...
    particles.minSize = 0.05;
    particles.maxSize = 0.10;
    # // Life time of each particle (random between...
    particles.minLifeTime = 0.3;
    particles.maxLifeTime = 1.5;
    # // Emission rate
    particles.emitRate = 10;
    # // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    # particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD
    # // Set the gravity of all particles
    particles.gravity = new BABYLON.Vector3(0, -5, 0);
    # // Direction of each particle after it has been emitted
    particles.direction1 = new BABYLON.Vector3(0, 5, 0);
    particles.direction2 = new BABYLON.Vector3(0, 5, 0);
    # // Angular speed, in radians
    # particles.minAngularSpeed = 0;
    # particles.maxAngularSpeed = Math.PI;
    # // Speed
    particles.minEmitPower = 0.5;
    particles.maxEmitPower = 1.0;
    particles.updateSpeed = 0.005;
    # // Start the particle system
    particles.start();

generate_particles_scene = (scene, landscape, img)->
    particles = new BABYLON.ParticleSystem("particles", 50, scene);
    particles.particleTexture = new BABYLON.Texture(img, scene);
    particles.emitter = landscape
    particles.minEmitBox = new BABYLON.Vector3(-8,-4,-8)
    particles.maxEmitBox = new BABYLON.Vector3( 8, 4, 8)
    # // Colors of all particles
    particles.color1 = colors.White
    particles.color2 = colors.Lemon
    particles.colorDead = colors.Black
    # // Size of each particle (random between...
    particles.minSize = 0.1
    particles.maxSize = 0.5
    # // Life time of each particle (random between...
    particles.minLifeTime = 1.0;
    particles.maxLifeTime = 2.5;
    # // Emission rate
    particles.emitRate = 4;
    # // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    # particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD
    # // Set the gravity of all particles
    particles.gravity = new BABYLON.Vector3(0, -1, 0);
    # // Direction of each particle after it has been emitted
    particles.direction1 = new BABYLON.Vector3(0, 1, 0);
    particles.direction2 = new BABYLON.Vector3(0, 1, 0);
    # // Angular speed, in radians
    # particles.minAngularSpeed = 0;
    # particles.maxAngularSpeed = Math.PI;
    # // Speed
    particles.minEmitPower = 0.5;
    particles.maxEmitPower = 1.0;
    particles.updateSpeed = 0.005;
    # // Start the particle system
    particles.start();



ngon = (ctx, x, y, r, n)->
    ctx.beginPath x+r, y
    for i in [0..n]
        a = Math.PI*2 / n
        ctx.lineTo x+r*Math.sin(a * i), x+r*Math.cos(a * i)
    ctx.closePath()

generate_glyphs_txt = (scene, size)->
    console.log scene
    sides = [0, 1, 3, 4, 6, 32]
    txt = new BABYLON.DynamicTexture("glyphs texture", size*8, scene, true, BABYLON.Texture.BILINEAR_SAMPLINGMODE)
    # txt.hasAlpha = true
    ctx = txt.getContext()
    s2 = size/2.0
    ctx.save()
    for y in [0...7]
        ctx.save()
        for x in [0...7]
            r = size/3.0
            c = colors[color_names[Math.random()*color_names.length|0]]            
            ctx.fillStyle = "rgba(#{c.r*255}, #{c.g*255}, #{c.b*255}, 0.001)"
            ctx.fillRect 0, 0, size, size
            n = sides[(x*y)%sides.length]
            switch n
                when 0
                    ctx.beginPath()
                    ctx.moveTo s2-r, s2-r
                    ctx.lineTo s2+r, s2+r
                    ctx.moveTo s2+r, s2-r
                    ctx.lineTo s2-r, s2+r
                    ctx.closePath()
                when 1
                    ctx.beginPath()
                    ctx.moveTo s2  , s2-r
                    ctx.lineTo s2  , s2+r
                    ctx.moveTo s2+r, s2
                    ctx.lineTo s2-r, s2
                    ctx.closePath()
                else
                    ngon ctx, s2, s2, r, n
                    
            ctx.strokeStyle = "rgba(#{c.r*255}, #{c.g*255}, #{c.b*255}, 0.95)"
            ctx.lineWidth = 4+Math.random()*5
            ctx.stroke()
            ctx.translate size, 0
        ctx.restore()
        ctx.translate 0, size        
    ctx.restore()
    txt.update()
    txt

generate_glyphs = (scene, parent, count)->

    root = new BABYLON.MeshBuilder.CreateBox("glyphs root", 0.1)
    root.parent = parent if parent?
    root.isVisible = false

    glyph_size = 128
    glyphs_mat = new BABYLON.StandardMaterial "glyphs material", scene, true
    glyphs_txt = generate_glyphs_txt scene, glyph_size
    # glyphs_mat.alpha = 0.9999
    # glyphs_mat.ambientColor    = BABYLON.Color3.White()
    glyphs_mat.opacityTexture  = glyphs_txt
    # glyphs_mat.ambientTexture = glyphs_txt
    glyphs_mat.emissiveTexture = glyphs_txt
    glyphs_mat.alphaMode = BABYLON.Engine.ALPHA_COMBINE
    
    # $("body").prepend glyphs_txt.getContext().canvas
    root.glyphs = []
    for i in [0...100]
        params = 
            width: 0.25 
            height:0.25
            updatable: true

        glyph = new BABYLON.MeshBuilder.CreatePlane "glyph", params, scene
        glyph.isVisible = false if i > count
        glyph.material = glyphs_mat
        glyph.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL
        glyph.parent = root

        # offset uv
        uvs = glyph.getVerticesData BABYLON.VertexBuffer.UVKind
        step = 1.0/8.0
        du = (Math.random()*8|0)*step
        dv = (Math.random()*8|0)*step
        for i in [0...uvs.length] by 2
            uvs[i+0] = du + uvs[i+0]*step
            uvs[i+1] = dv + uvs[i+1]*step
        glyph.updateVerticesData(BABYLON.VertexBuffer.UVKind, uvs)
        root.glyphs.push glyph
        
    root.update_glyphs_pos = (seed, count)->
        Math.seedrandom seed
        for glyph, i in root.glyphs
            s = 0.5+Math.random()*1.5
            glyph.scaling.x = s
            glyph.scaling.y = s
            glyph.position.x = (Math.random()-0.5)*8.0
            glyph.position.y = Math.random()*1.0
            glyph.position.z = (Math.random()-0.5)*8.0
            glyph.isVisible = i < count
    
    root

init = ->

    canvas = $('#canvas')[0]
    engine = new BABYLON.Engine canvas, true

    scene = new BABYLON.Scene engine
    scene.clearColor = colors[cfg.scene.background]

    camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", -Math.PI/2.0, Math.PI/2.5, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setTarget BABYLON.Vector3.Zero()
    # camera.attachControl canvas, false

    gui = new dat.GUI
    f = gui.addFolder "scene"
    f.add(cfg.scene, "background", color_names).onFinishChange (name)->scene.clearColor = colors[name]


    # SCENE GLYPH
    
    scene_glyphs = generate_glyphs scene, null, 10
    scene_glyphs.rotation.x = Math.PI / 2
    scene_glyphs.position.z = -2.0
    scene_glyphs.update_glyphs_pos cfg.scene.glyphs.seed, cfg.scene.glyphs.count
    scene_glyphs.scaling.x = 4.0
    s = f.addFolder "glyphs"
    s.add(cfg.scene.glyphs, "seed" , 0, 1000, 1).onChange (val)->
        scene_glyphs.update_glyphs_pos cfg.scene.glyphs.seed, cfg.scene.glyphs.count
    s.add(cfg.scene.glyphs, "count", 0,  100, 1).onChange (val)->
        scene_glyphs.update_glyphs_pos cfg.scene.glyphs.seed, cfg.scene.glyphs.count
    

    # LANDSCAPE

    landscape = create_landscape scene
    update_landscape = ->
        landscape.rotation.y = cfg.landscape["rotation y"]
        landscape.scaling.y  = cfg.landscape["height"]
        
        landscape.parent.rotation.x = cfg.landscape["rotation x"]
        landscape.parent.position.x = cfg.landscape["x"]
        landscape.parent.position.y = cfg.landscape["y"]
        landscape.parent.position.z = cfg.landscape["z"]
        landscape.parent.scaling.x  = landscape.parent.scaling.y = landscape.parent.scaling.z = cfg.landscape["scale"]

    update_landscape()

    f = gui.addFolder "landscape"
    f.add(cfg.landscape, "seed"      , 0       , 10000       ).onChange (val)-> landscape.rebuild val
    f.add(cfg.landscape, "height", 0.01, 4, 0.01             ).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "rotation y", -Math.PI, Math.PI,0.01).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "rotation x", -Math.PI, Math.PI,0.01).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "x"     ,   -4, 4, 0.01             ).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "y"     ,   -4, 4, 0.01             ).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "z"     ,   -4, 4, 0.01             ).onChange (val)-> update_landscape()
    f.add(cfg.landscape, "scale" , 0.25, 4, 0.01             ).onChange (val)-> update_landscape()
   
    # GLYPHS
    landscape_glyphs = generate_glyphs scene, landscape, cfg.landscape.glyphs.count
    landscape_glyphs.update_glyphs_pos cfg.landscape.glyphs.seed, cfg.landscape.glyphs.count
   
    s = f.addFolder "glyphs"
    s.add(cfg.landscape.glyphs, "seed" , 0, 1000).onChange (val)->
        landscape_glyphs.update_glyphs_pos cfg.landscape.glyphs.seed, cfg.landscape.glyphs.count
    s.add(cfg.landscape.glyphs, "count", 0, 100, 1).onChange (val)->
        landscape_glyphs.update_glyphs_pos cfg.landscape.glyphs.seed, cfg.landscape.glyphs.count

    # LOGO
    
    h_aligns = 
        center: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
        left  : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        right : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
 
    v_aligns = 
        center: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        top   : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        bottom: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        
    advanced_txt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    logo = new BABYLON.GUI.Image "logo", "logo_#{cfg.logo.color}.png"
    advanced_txt.addControl logo
    logo.autoScale = true
    logo.horizontalAlignment = h_aligns[cfg.logo["h align"]]
    logo.verticalAlignment   = v_aligns[cfg.logo["v align"]]
    f = gui.addFolder "logo"
    f.add(cfg.logo, "color"  , color_names).onChange (val)-> logo.source = "logo_#{val}.png"
    f.add(cfg.logo, "h align", ["left", "center",  "right"]).onChange (val)->logo.horizontalAlignment = h_aligns[val]
    f.add(cfg.logo, "v align", ["top" , "center", "bottom"]).onChange (val)->logo.verticalAlignment   = v_aligns[val]
    

        

    # FINISH
    engine.runRenderLoop -> do scene.render
    window.addEventListener 'resize', -> do engine.resize


$ ->
    console.log "START"
    do init
