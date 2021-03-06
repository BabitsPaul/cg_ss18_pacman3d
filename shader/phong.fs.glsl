/**
* a phong shader implementation with texture support
*/
precision mediump float;

/**
* definition of a material structure containing common properties
*/
struct Material {
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
    vec4 emission;
    float shininess;
};

/**
* definition of the light properties related to material properties
*/
struct Light {
    vec4 ambient;
    vec4 diffuse;
    vec4 specular;
};

//illumination related variables
uniform Material u_material;
uniform Light u_light;

varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;

//texture related variables
uniform bool u_enableObjectTexture;

uniform sampler2D u_tex;
varying vec2 v_texture_coordinate;

vec4 calculateSimplePointLight(Light light, Material material, vec3 lightVec, vec3 normalVec, vec3 eyeVec, vec4 textureColor) {
    lightVec = normalize(lightVec);
    normalVec = normalize(normalVec);
    eyeVec = normalize(eyeVec);

    //compute diffuse term
    float diffuse = max(dot(normalVec,lightVec),0.0);

    //compute specular term
    vec3 reflectVec = reflect(-lightVec,normalVec);
    float spec = pow( max( dot(reflectVec, eyeVec), 0.0) , material.shininess);

    if(u_enableObjectTexture)
    {
        material.diffuse = textureColor;
        material.ambient = textureColor;
    }

    vec4 c_amb  = clamp(material.ambient * light.ambient, 0.0, 1.0);
    vec4 c_diff = clamp(material.diffuse * diffuse * light.diffuse, 0.0, 1.0);
    vec4 c_spec = clamp( material.specular * spec * light.specular, 0.0, 1.0);
    vec4 c_em   = material.emission;

    return c_amb + c_diff + c_spec + c_em;
}

void main (void) {
    vec4 textureColor = vec4(0,0,0,1);

    if(u_enableObjectTexture)
    {
        textureColor = texture2D(u_tex, v_texture_coordinate);
    }

    gl_FragColor = calculateSimplePointLight(u_light, u_material, v_lightVec, v_normalVec, v_eyeVec, textureColor);
}