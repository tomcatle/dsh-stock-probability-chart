// dsh-stock-probability-chart
// 向 DeepSeek Harness 注册一个内置 skill：股票概率图。
// 该 skill 的方法论与资源全部随插件打包，安装即用，不依赖任何外部技能或工具名。

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

export const name = 'dsh-stock-probability-chart'

// 声明依赖的服务；框架保证 apply 执行时 ctx.skills 已就绪
export const inject = ['skills']

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = join(HERE, 'skills')

// 正文在文件里，便于随包更新；resourceBase 指向技能目录，
// 使 SKILL.md 中 references/ 与 assets/ 的相对路径可被解析。
const SKILL_CONTENT = readFileSync(join(SKILLS_DIR, 'SKILL.md'), 'utf8')

export function apply(ctx) {
  const dispose = ctx.skills.register({
    // 必填：kebab-case，中文名靠 description 触发
    name: 'stock-scenario-probability',
    description:
      '股票概率图（中文别名）。评估单只股票未来短周期（1周至1个月）的上涨/下跌情景概率，并输出红涨绿跌的四情景概率分布图。当用户提到「股票概率图」「做个股票概率图」，或询问某只股票的上涨概率、短期趋势方向、下周走势判断、能否持仓过周末、趋势评估，或要求把概率/趋势判断可视化时使用。基于结构化主观信号加权，非统计回测。',
    content: SKILL_CONTENT,

    // 显式声明来源，规避「注册成功、加载失败：source must be a string」问题
    source: 'runtime',
    provider: 'dsh-stock-probability-chart',

    // 模型与用户均可触发
    invocation: { modelInvocable: true, userInvocable: true },

    // 给 skill 内的相对引用提供根目录
    resourceBase: { kind: 'directory', path: SKILLS_DIR },

    metadata: {
      tags: ['stock', 'probability', 'skill', '股票', '概率图'],
      whenToUse:
        '用户问某只股票短周期涨跌概率、趋势方向、能否持仓过周末，或要求把趋势/概率判断可视化。',
    },
  })

  ctx.logger?.debug?.('[dsh-stock-probability-chart] skill registered: stock-scenario-probability')

  // 返回 disposer：插件卸载/热重载时精确撤销本次注册，不影响用户自带的同名 skill
  return dispose
}
