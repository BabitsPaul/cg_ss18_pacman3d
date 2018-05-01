//////////////////////////////////////////////////////////////////////
// Uptdate position for intermediate steps
//

/** * calculate coordinates
 * Coordinates are set by object self.
 * Given a starting and ending point, intermediate points are calculated
 * @param dt timeintervall sinze beginning
 * @param tt total time for movement between the two points
 * @param sV startVector
 * @param eV endVector
 */

 function Vector updatePosition(dt, tt, sV, eV){
   var V = new Vector(0.0, 0.0, 0.0);
   pp = dt/tt; //proportion of dt from tt
   V[0] = (1-pp)*sV[0] + pp*eV[0];
   V[1] = (1-pp)*sV[1] + pp*eV[1];
   V[2] = (1-pp)*sV[2] + pp*eV[2];
   return V;
 }
