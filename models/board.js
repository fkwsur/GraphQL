module.exports = (sequelize, DataTypes) => {
	const board = sequelize.define(
		'board',
		{
			idx : {
				type: DataTypes.INTEGER,
				primaryKey : true,
				autoIncrement : true,
				allowNull : false
			},
			username : {
				type : DataTypes.STRING,
				allowNull : false
			},
			title : {
				type : DataTypes.STRING,
				allowNull : false
			},
      content : {
				type : DataTypes.STRING,
				allowNull : false
			},
		},
		{
			freezeTableName : true,
			timestamps : false,
			comment : '게시판'
		}
	);
	return board;
}