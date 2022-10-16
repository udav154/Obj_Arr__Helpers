export class Helpers {


  unicArr(arr) {
    const result = [];
    const duplicatesIndices = [];

    // Перебираем каждый элемент в исходном массиве
    arr.forEach((current, index) => {
      if (duplicatesIndices.includes(index)) return;

      result.push(current);

      // Сравниваем каждый элемент в массиве после текущего
      for (
        let comparisonIndex = index + 1;
        comparisonIndex < arr.length;
        comparisonIndex++
      ) {
        const comparison = arr[comparisonIndex];
        const currentKeys = Object.keys(current);
        const comparisonKeys = Object.keys(comparison);

        // Проверяем длину массивов
        if (currentKeys.length !== comparisonKeys.length) continue;

        // Проверяем значение ключей
        const currentKeysString = currentKeys.sort().join("").toLowerCase();
        const comparisonKeysString = comparisonKeys
          .sort()
          .join("")
          .toLowerCase();
        if (currentKeysString !== comparisonKeysString) continue;

        // Проверяем индексы ключей
        let valuesEqual = true;
        for (let i = 0; i < currentKeys.length; i++) {
          const key = currentKeys[i];
          if (current[key] !== comparison[key]) {
            valuesEqual = false;
            break;
          }
        }
        if (valuesEqual) duplicatesIndices.push(comparisonIndex);
      }
    });
    return result;
  }

  deepSearch(obj, key, val) {
    let objects = [];
    for (let item in obj) {
      if (!obj.hasOwnProperty(item)) continue;
      if (typeof obj[item] == "object") {
        objects = objects.concat(deepSearch(obj[item], key, val));
      } else if (
        (item == key && obj[item] == val) ||
        (item == key && val == "")
      ) {
        objects.push(obj);
      } else if (obj[item] == val && key == "") {
        if (objects.lastIndexOf(obj) == -1) {
          objects.push(obj);
        }
      }
    }
    return objects;
  }

  /**
   * найдет и поменяет значение в дереве
   * @param {*} obj
   * @param {*} key
   * @param {*} val
   * @param {*} setter  object setter {key, value}
   * @returns new three
   */
  deepSeter(obj, key, val, setter) {
    const object = obj;
    const setterHandler = () => {
      const setValueField = (value, oldValue) => {
        switch (value) {
          case "toggler":
            return !!oldValue;
          default:
            return value;
        }
      };
      for (let keyFor in object) {
        if (!object.hasOwnProperty(keyFor)) continue;
        if (typeof object[keyFor] == "object") {
          deepSeter(object[keyFor], key, val, setter);
        } else if (
          (keyFor == key && object[keyFor] == val) ||
          (keyFor == key && val == "")
        ) {
          object[setter.key] = setValueField(setter.value, object[setter.key]);
        }
      }
    };
    setterHandler();
    return object;
  }

  deleteElementArray(arr = [], value = "") {
    const currentIndex = arr.indexOf(value);
    const firstSide = arr.slice(0, currentIndex);
    const secondSide = arr.slice(currentIndex + 1);
    const newArr = firstSide.concat(secondSide);
    return newArr;
  }

  uniqueConcatArray(arr1 = [], arr2 = []) {
    const concatArrays = arr1.concat(arr2);
    const result = concatArrays.filter(
      (item, pos) => concatArrays.indexOf(item) === pos
    );
    return result;
  }

  getFilteredArray  (firstArr = [], secondArr = []) {
    return firstArr.filter((el, idx) => !secondArr.includes(idx))
  }

/**
 * Глубокий поиск всех элементов подходящих по параметрам
 * todo: переделать на веб воркер
 * @param {*} property
 * @param {*} value
 * @param {*} startNode
 * sercheAllObjectByProperty('name', 'BOX' , scene)
 */
  sercheAllObjectByProperty  (property, value, startNode) {
  let result = [];

  const getObjectByProperty = (start, target) => {
    const isFindedObj = this.lodashGet(start, property);
    if (isFindedObj) {
      if (isFindedObj === target) {
        result.push(start);
      }
    }
    for (var i = 0; i < start.children.length; i++) {
      getObjectByProperty(start.children[i], target);
    }
    return null;
  };
  getObjectByProperty(startNode, value);
  return result;
};

/**
 * гет как в лодаше только короче
 * @param {*} object
 * @param {*} path
 * @param {*} defval
 * @returns value
 */
  lodashGet (object, path, defval = null)  {
  if (typeof path === "string") path = path.split(".");
  return path.reduce((xs, x) => (xs && xs[x] ? xs[x] : defval), object);
};

}
