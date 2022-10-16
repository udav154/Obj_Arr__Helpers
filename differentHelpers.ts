export class DifferentHelpers {

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "0x";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   *? recursively find Viewport instance
   * @param {*} element
   * @returns viewports
   */
  getViewportElement(element) {
    const checkParentsNode = (element) => {
      for (let i = 0; i < element.children.length; i++) {
        const item = element.children[i];
        if (item.name === "Viewport") {
          return item;
        }
      }
    };
    const getApp = (element) => {
      if (!element?.parent) return element;
      return getApp(element.parent);
    };
    const app = getApp(element.parent);
    const viewportFromParent = checkParentsNode(app);
    if (viewportFromParent) {
      return viewportFromParent;
    }
  }

  /**
   *? get percent ratio between two points
   * @param {*} global
   * @param {*} insertable
   * @returns
   */
  getPercentFromNumber = (global, inserteble) => {
    return (inserteble / Number(global)) * 100;
  };

  /**
   *? get all ireractions vector of meshs
   * @param {*} from Vector3 From
   * @param {*} to Vector3 To
   */
  rayIntersections(from, to, meshList) {
    const vector3From = from.normalize();
    const vector3To = to.normalize();

    const ray = new Raycaster(vector3From, vector3To);
    const intersections = ray.intersectObjects(meshList);
    return intersections;
  }


  /**
   *? Callback dependent on device type
   */

  checkDevice(mobileCallback = () => {}, desctopCallback = () => {}) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // код для мобильных устройств
      mobileCallback();
    } else {
      desctopCallback();
      // код для обычных устройств
    }
  }

  /**
   *? 
   * @param {*} DraggedObj object3d
   * @param {*} collidableMeshList - arr object3d
   * @return {boolean} - predicate
   */
  findCollisionMeshList(
    DraggedObj = null,
    collidableMeshList = [],
    callback = () => {}
  ) {
    for (
      let vertexIndex = 0;
      vertexIndex < DraggedObj.geometry.attributes.position.array.length;
      vertexIndex++
    ) {
      const localVertex = new Vector3()
        .fromBufferAttribute(
          DraggedObj.geometry.attributes.position,
          vertexIndex
        )
        .clone();
      const globalVertex = localVertex.applyMatrix4(DraggedObj.matrix);
      const directionVector = globalVertex.sub(DraggedObj.position);

      const ray = new Raycaster(
        DraggedObj.position,
        directionVector.clone().normalize()
      );
      const collisionResults = ray.intersectObjects(collidableMeshList);

      if (
        collisionResults.length > 0 &&
        collisionResults[0].distance < directionVector.length()
      ) {
        callback(collisionResults, directionVector);
        return collisionResults;
      }
    }
    return false;
  }


  //!!!!!!!! Генерация адаптивного текста на 3D боксах 
  // todo Перенести в отдельную репу
  /**
   * создаст массив материалов на видимые стороны коробок с текстом
   * @param {*} param0
   * @returns
   */
  getParamsForLabelMaterial({ color, size, text }) {
    const { width, height, length } = size;
    const paraps0 = {
      width: width,
      height,
    };
    const paraps2 = {
      width: length,
      height: width,
      rotate: Math.PI,
    };
    const paraps5 = {
      width: length,
      height,
    };

    // const map = generateLabelMaterial({ color });
    const map0 = generateLabelMaterial({ color, text, ...paraps0 });
    const map2 = generateLabelMaterial({ color, text, ...paraps2 });
    const map5 = generateLabelMaterial({ color, text, ...paraps5 });

    const materialArray = [
      new MeshStandardMaterial({ map: map0, color }),
      new MeshStandardMaterial({ color }),
      new MeshStandardMaterial({ map: map2, color }),
      new MeshStandardMaterial({ color }),
      new MeshStandardMaterial({ color }),
      new MeshStandardMaterial({ map: map5, color }),
    ];

    return materialArray;
  }

  /**
   * добавляет к 2д контексту канваса функцию которая из данного ей текста
   * отрисует в html текст в заданными параметрами и возьмет его свойства тк из 2д канваса нельзя взять свойства такие
   */
  addInfoTextFuncAtCanvas() {
    CanvasRenderingContext2D.prototype.getInfoText = function ({
      text,
      FontSizePt,
      bold = true,
      fontName = "Open Sans",
    }) {
      const div = document.createElement("DIV");
      div.id = "__textMeasure";
      div.innerHTML = text;
      div.style.position = "absolute";
      div.style.top = "-500px";
      div.style.left = "0";
      div.style.fontFamily = fontName;
      div.style.fontWeight = bold ? "bold" : "normal";
      div.style.fontSize = FontSizePt + "pt";
      document.body.appendChild(div);

      const cssSize = { width: div.offsetWidth, height: div.offsetHeight };
      const cssInfo = window.getComputedStyle(div, null);
      const fontSizePx = parseFloat(cssInfo.fontSize);

      document.body.removeChild(div);
      return { ...cssSize, fontSizePx };
    };
  }
  /**
   * добавляет к 2д контексту канваса функцию которая высчитает сколько строк поличится из текста по макс ширине
   * и число строк которое влезет по высоте и ширине
   */
  addGetMaxCountLineAtCanvas() {
    CanvasRenderingContext2D.prototype.getMaxCountLine = function ({
      text,
      maxWidth,
      maxHeight,
      lineHeight,
    }) {
      let count = 1;
      let allCount = 1;
      let sumHeight = lineHeight;
      const words = text.split(" ");
      let line = "";
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        const testWidth = this.measureText(testLine).width;

        if (testWidth > maxWidth && i > 0) {
          if (sumHeight < maxHeight) count++;
          line = words[i] + " ";
          allCount++;
          sumHeight += lineHeight;
        } else {
          line = testLine;
        }
      }
      return { count, allCount };
    };
  }

  /**
   * функция которая разбивает текст на строки по максимальной ширине строки
   * и рисует только то количество строк которое влезло по высоте
   * и ровняет по высоте на середине блока
   */
  addWrapTextFuncAtCanvas() {
    CanvasRenderingContext2D.prototype.wrapText = function ({
      text,
      beginX = 0,
      beginY = maxWidth / 2,
      maxWidth,
      maxHeight,
      lineGap = 0,
      lineHeight,
    }) {
      const { count: maxLines, allCount: allCountLines } = this.getMaxCountLine(
        { text, maxWidth, maxHeight, lineHeight }
      );
      let countLine = 1;
      let y = beginY - (maxLines * lineHeight) / 2;

      console.log("maxLines", maxLines, "allCountLines", allCountLines);
      // разделяем текст по пробелам
      const words = text.split(" ");
      let line = "";

      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + " ";
        // получить ширину тестовой линии
        const testWidth = this.measureText(testLine).width;
        // если вычисляемая строка будет выходить за пределы ограничегоно пространства, то закончим рисовать
        if (countLine > maxLines) return;
        // если все ок, то прочеряем строчку на ширину
        if (testWidth > maxWidth && i > 0) {
          // если боьше максимальной ширины то рисуем line (не testLine) без последнего слова
          // и "переводим каретку" на след строчку
          if (countLine + 1 > maxLines && countLine !== allCountLines) {
            line = line + "...";
          }
          this.fillText(line, beginX, y, maxWidth);
          this.strokeText(line, beginX, y, maxWidth);
          line = words[i] + " ";
          countLine += 1;
          y += lineHeight;
          // если не больше макс ширины то линия === тест линия (линия + след слово)
        } else {
          line = testLine;
        }
      }
      // cюда попадаем на самой последней итерации когда слова кончились и они не отрисовались
      // значит отрисуем здесь (но только если они влезают по размерам)
      if (countLine > maxLines) return;
      this.fillText(line, beginX, y, maxWidth);
      this.strokeText(line, beginX, y, maxWidth);
      y += lineHeight;
      countLine += 1;
    };
  }

  /**
   * Позволяет использовать канвас в место изображения для материалов (Для динамики можно использовать)
   * @param text
   * @param color
   * @param width
   * @param height
   * @return {Texture}
   */
  generateLabelMaterial({
    text = "",
    color = "#fff",
    rotate = false,
    width = 500,
    height = 800,
    textParams = {},
  }) {
    addWrapTextFuncAtCanvas();
    addInfoTextFuncAtCanvas();
    addGetMaxCountLineAtCanvas();

    const mnojitel = 40;
    const fontSize =
      height <= width ? mnojitel * (height / 100) : mnojitel * (width / 100);
    const {
      fillTextXAxias = width / 2,
      fillTextYAxias = height / 2,
      font = `bold ${fontSize}pt Open Sans`,
    } = textParams;

    const canvas = document.createElement("canvas");
    const xc = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    // зеливка квадрата и контуров
    xc.fillStyle = color;
    xc.fillRect(0, 0, canvas.width, canvas.height);
    xc.strokeRect(0, 0, canvas.width, canvas.height);
    // создание текста
    xc.font = font;
    xc.strokeStyle = "#fff";
    xc.fillStyle = "#000";
    xc.textAlign = "center";
    xc.textBaseline = "top";
    // получение инфы о тексте (нужно lineHeight)
    const cssTextInfo = xc.getInfoText({ text, FontSizePt: fontSize });
    const metrics = xc.measureText(text);
    const lineGap = Math.abs(
      cssTextInfo.fontSizePx -
        (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)
    );
    // расчет линий текста и их отрисовка

    xc.wrapText({
      text,
      beginX: fillTextXAxias,
      beginY: fillTextYAxias,
      maxWidth: width,
      maxHeight: height,
      lineHeight: cssTextInfo.fontSizePx,
      lineGap,
    });
    xc.stroke();

    const map = new CanvasTexture(canvas);
    map.needsUpdate = true;
    return map;
  }
}
