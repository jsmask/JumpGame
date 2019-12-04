export default {
  pointInPolygon(point, vs) {
    var x = point[0], y = point[1]
    
    var inside = false

    const xMin = vs[0][0] > vs[2][0] ? vs[2][0] : vs[0][0]
    const xMax = vs[0][0] < vs[2][0] ? vs[2][0] : vs[0][0]

    const yMin = vs[0][1] > vs[1][1] ? vs[1][1] : vs[0][1]
    const yMax = vs[0][1] < vs[1][1] ? vs[1][1] : vs[0][1]

    if (x > xMin && x < xMax && y > yMin && y < yMax) {
      inside = true
    }
    return inside
  }, 

  merge (totalGeometry, geometry, index, positions) {
    for (var i = 0, len = geometry.faces.length; i < len; ++i) {
      geometry.faces[i].materialIndex = 0;
    }
    var mesh = new THREE.Mesh(geometry);
    for (var i = 0, len = positions.length; i < len; ++i) {
      mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
      mesh.updateMatrix();
      totalGeometry.merge(mesh.geometry, mesh.matrix, index);
    }
  },

  mapUv (textureWidth, textureHeight, geometry, faceIdx, x1, y1, x2, y2, flag) {
    var tileUvW = 1 / textureWidth;
    var tileUvH = 1 / textureHeight;
    if (geometry.faces[faceIdx] instanceof THREE.Face3) {
      var UVs = geometry.faceVertexUvs[0][faceIdx * 2];
      if (faceIdx == 4 && !flag) {
        UVs[0].x = x1 * tileUvW;UVs[0].y = y1 * tileUvH;
        UVs[2].x = x1 * tileUvW;UVs[2].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW;UVs[1].y = y1 * tileUvH;
      } else {
        UVs[0].x = x1 * tileUvW;UVs[0].y = y1 * tileUvH;
        UVs[1].x = x1 * tileUvW;UVs[1].y = y2 * tileUvH;
        UVs[2].x = x2 * tileUvW;UVs[2].y = y1 * tileUvH;
      }
      var UVs = geometry.faceVertexUvs[0][faceIdx * 2 + 1];
      if (faceIdx == 4 && !flag) {
        UVs[2].x = x1 * tileUvW;UVs[2].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW;UVs[1].y = y2 * tileUvH;
        UVs[0].x = x2 * tileUvW;UVs[0].y = y1 * tileUvH;
      } else {
        UVs[0].x = x1 * tileUvW;UVs[0].y = y2 * tileUvH;
        UVs[1].x = x2 * tileUvW;UVs[1].y = y2 * tileUvH;
        UVs[2].x = x2 * tileUvW;UVs[2].y = y1 * tileUvH;
      }
    }
  }
}