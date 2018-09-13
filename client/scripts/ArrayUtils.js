/*
 * returns a random element from an array
 *
 * @param arr the array to select an random element from
 * @return the random element
 */
function chooseFromArray(arr){
  const min = 0
  const max = arr.length
  return arr[randomInt(min, max)]
}

/*
 * returns a random integer in the range [lb, ub)
 *
 * @param lb the lowerbound of the range to choose from
 * @param ub the upperbound of the range to choose from
 * @return the random integer
 */
function randomInt(lb, ub){
        return Math.floor((Math.random() * (ub - lb)) + lb)
}
