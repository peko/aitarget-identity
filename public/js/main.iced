colors = 
    Digi_Violet  : new BABYLON.Color3(0x7D/255.0, 0x25/255.0, 0xFB/255.0) # "#7D25FB"
    Lemon        : new BABYLON.Color3(0xFD/255.0, 0xF5/255.0, 0x6C/255.0) # "#FDF56C"
    Black        : new BABYLON.Color3(0x00/255.0, 0x00/255.0, 0x00/255.0) # "#000000"
    White        : new BABYLON.Color3(0xFF/255.0, 0xFF/255.0, 0xFF/255.0) # "#FFFFFF"
    Rose         : new BABYLON.Color3(0xFF/255.0, 0xA9/255.0, 0xBE/255.0) # "#FFA9BE"
    Graphite     : new BABYLON.Color3(0x1C/255.0, 0x1B/255.0, 0x21/255.0) # "#1C1B21"

init = ->
    canvas = $('#canvas')[0]
    engine = new BABYLON.Engine canvas, true

    createScene = ->
        scene = new BABYLON.Scene engine
        scene.clearColor = colors.Digi_Violet

        # p =  new BABYLON.Vector3 0, 5, -10
        # camera = new BABYLON.FreeCamera('camera1',p, scene)
        camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setTarget BABYLON.Vector3.Zero()
        camera.attachControl canvas, false
        
        p = new BABYLON.Vector3(0, 1, 0)
        light = new BABYLON.HemisphericLight('light1', p, scene)

        landscape_mat = new BABYLON.ShaderMaterial("landscape", scene, "./landscape", {
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
        })
        landscape_mat.backFaceCulling = false
        landscape_txt = new BABYLON.Texture("landscape_gradient.png", scene);
        landscape_mat.setTexture("textureSampler", landscape_txt);

        # normal_mat = new BABYLON.NormalMaterial("normal", scene, false);
        # normal_mat.backFaceCulling = false


        
        generate_paths  = ->
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
        landscape_mesh = new BABYLON.Mesh.CreateRibbon("ribbon", paths, false, false, null, scene,true);
        landscape_mesh.material = landscape_mat;
        #  morphing
        scene.registerBeforeRender ->
            if Math.random() > 0.99
                paths_t = generate_paths()            
            for path, i in paths
                for v, j in path
                    paths[i][j].y+= (paths_t[i][j].y-paths[i][j].y)/50.0
            landscape_mesh = BABYLON.Mesh.CreateRibbon(null, paths, null, null, null, null, null, null, landscape_mesh);
        
        scene

    scene = createScene()
    engine.runRenderLoop -> do scene.render

    window.addEventListener 'resize', -> do engine.resize

$ ->
    console.log "START"
    do init
