// The WHERE clause is used to filter records. It is used to extract only those records that fulfill a specified condition.

//base : product.find({email})

//bigQ :  search=coder&page=2&category=anything&rating[gte]=4&price[lte]=999&price[gte]=199

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
            $options: "i", // i for case insensitive and 'g' is more global
          },
        }
      : {};

    this.base = this.base.find({ ...searchWord });
    return this;
  }

  //Aggrigation
  filter() {
    let copyQ = { ...this.bigQ };

    delete copyQ["search"];
    delete copyQ["page"];
    delete copyQ["limit"];

    //convert copyQ into string
    let stringCopyQ = JSON.stringify(copyQ);
    stringCopyQ = stringCopyQ.replace(/\b(gte|lte|gte)\b/g, (m) => `$${m}`);

    const jsonCopyQ = JSON.parse(stringCopyQ);
    this.base = this.base.find(jsonCopyQ);
    return this;
  }

  pager(resultPerPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }
    const skipValues = resultPerPage * (currentPage - 1);
    this.base = this.base.limit(resultPerPage).skip(skipValues);
    return this;
  }
}

module.exports = WhereClause;
