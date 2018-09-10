/**
 * WebGLHelper
 */
function WebGLHelper() {}

/**
 * 创建程序
 *
 * @param {Object} gl WebGL context
 * @param {Object} vShaderObject vertex shader program
 * @param {Object} fShaderObject fragment shader program
 * @return {Object}
 */
WebGLHelper.initProgramWithShader = function(gl, vShaderObject, fShaderObject) {
    var program = gl.createProgram();
    
    gl.attachShader(program, vShaderObject);
    gl.attachShader(program, fShaderObject);
    gl.linkProgram(program);
    
    var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linked) {
        var error = gl.getProgramInfoLog(program);
        console.log('Failed to link program: ' + error);
        
        gl.deleteProgram(program);
        gl.deleteShader(fShaderObject);
        gl.deleteShader(vShaderObject);
        
        return null;
    }
    
    gl.useProgram(program);
    gl._program = program;
    
    return program;
};

/**
 * Create a shader object
 *
 * @param {Object} gl WebGL context
 * @param {Number} type the type of the shader object to be created
 * @param {String} source shader program
 * @return {Object | null}
 */
WebGLHelper.createShader = function(gl, type, source) {
    var shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compiled) {
        var error = gl.getShaderInfoLog(shader);
        console.log('Failed to compile shader: ' + error);
        
        gl.deleteShader(shader);
        
        return null;
    }
    
    return shader;
};
