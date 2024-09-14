class ApiFeatures {
  constructor(mongooseQuery, query) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { page, limit, sort, fields, keyword, ...filteringObject } = query;
    this.page = page;
    this.limit = limit;
    this.sortObject = sort;
    this.fields = fields;
    this.keyword = keyword;
    this.filteringObject = filteringObject;
  }

  filter() {
    let filterString = JSON.stringify(this.filteringObject);
    filterString = filterString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    filterString = JSON.parse(filterString);
    this.mongooseQuery = this.mongooseQuery.find(filterString);
    return this;
  }

  sort() {
    if (this.sortObject) {
      const sortby = this.sortObject.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortby);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  selectFields() {
    if (this.fields) {
      const fieldsNeeded = this.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fieldsNeeded);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  search(modelName) {
    if (this.keyword) {
      const query = {};
      if (modelName === "product") {
        query.$or = [
          { title: { $regex: this.keyword, $options: "i" } },
          { description: { $regex: this.keyword, $options: "i" } },
          { name: { $regex: this.keyword, $options: "i" } },
        ];
      } else {
        query.$or = [{ name: { $regex: this.keyword, $options: "i" } }];
      }
      query.$or = [
        { title: { $regex: this.keyword, $options: "i" } },
        { description: { $regex: this.keyword, $options: "i" } },
        { name: { $regex: this.keyword, $options: "i" } },
      ];
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  pagination(count) {
    const currentpage = this.page * 1 || 1;
    const pagelimit = this.limit * 1 || 5;
    const skip = (currentpage - 1) * pagelimit;
    const endIndex = currentpage * pagelimit;

    const pagination = {};
    pagination.currentpage = currentpage;
    pagination.limit = pagelimit;
    pagination.numberOfPages = Math.ceil(count / pagelimit);
    if (endIndex < count) {
      pagination.next = currentpage + 1;
    }
    if (skip > 0) {
      pagination.prev = currentpage - 1;
    }
    this.paginationResults = pagination;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(pagelimit);
    return this;
  }
}

module.exports = ApiFeatures;
