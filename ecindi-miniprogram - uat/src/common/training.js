export const getGradeBySuccessRate = (successRate) => {
  // 成功率级别
  // 0-40% 40-80% 80-100%
  // 分别对应级别 0 1 2
  let grade = 0

  successRate = parseFloat(successRate) * 100 || 0

  if (!successRate) {
    grade = 0
  } else if (successRate <= 40) {
    grade = 0
  } else if (successRate > 40 && successRate < 80) {
    grade = 1
  } else if (successRate >= 80) {
    grade = 2
  }

  return grade
}

export const getStyleVariableByGrade = (grade) => {
  switch (grade) {
    case 1:
      return '--box-bg-color: rgba(255, 132, 51, 0.2); --box-border-color: #ff8433; --box-text-color: #ff8433; --box-line-bg-color: rgba(255, 132, 51, 0.5); --box-line-border-color: #ff8433;'
    case 2:
      return '--box-bg-color: rgba(237, 23, 31, 0.2); --box-border-color: #ed171f; --box-text-color: #ed171f; --box-line-bg-color: rgba(237, 23, 31, 0.5); --box-line-border-color: #ed171f;'
    default:
      return '--box-bg-color: rgba(207, 207, 207, 0.2); --box-border-color: #cfcfcf; --box-text-color: #ffffff; --box-line-bg-color: rgba(207, 207, 207, 0.5); --box-line-border-color: #ffffff;'
  }
}

export const getGradeTextByGrade = (grade) => {
  switch (grade) {
    case 1:
      return '继续努力'
    case 2:
      return '非常完美'
    default:
      return '有待提升'
  }
}
