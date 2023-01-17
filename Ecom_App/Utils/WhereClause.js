// The WHERE clause is used to filter records. It is used to extract only those records that fulfill a specified condition.

class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchWord = this.bigQ.search
      ? {
          name: {
            //Both given by mongodb
            $regex: this.bigQ.search,
            $options: "i", // i for case sensitive and 'g' is more global
          },
        }
      : {};

    this.base = this.base.find(searchWord);
    return this;
  }
}

//base : product.find(email)

//bigq :  search=coder&page=2&category=anything&rating[gte]=4&price[lte]=999&price[gte]=199
