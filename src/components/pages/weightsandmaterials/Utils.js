export const numberWithCommas = (x) => {
    if (x === undefined) {
        return '';
    }
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }