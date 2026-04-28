import { Router, type Request, type Response } from 'express';
import * as letterService from '../services/ai.service.js';
import * as createLetter from '../services/letter.service.js';

const router: Router = Router();

/**
 * @openapi
 * /letters/ai/generate:
 *   post:
 *     summary: AI 편지 문구 생성
 *     description: 사용자가 입력한 초안을 선택한 카테고리와 톤에 맞춰 AI가 다듬어줍니다.
 *     tags:
 *       - Letters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - tone
 *               - draft_content
 *             properties:
 *               category:
 *                 type: string
 *                 description: "편지 카테고리 (예: 생일, 축하, 감사 등)"
 *                 example: "생일"
 *               tone:
 *                 type: string
 *                 description: "다듬을 톤 (예: 다정하게, 격식있게, 감성적인, 담백하게)"
 *                 example: "다정하게"
 *               draft_content:
 *                 type: string
 *                 description: "사용자가 작성한 편지 초안"
 *                 example: "00아 생일 축하해 오늘 즐거운 시간 보내고 맛있는 것도 많이 먹고 좋은 하루를 보내길 바래"
 *     responses:
 *       200:
 *         description: AI 문구 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     ai_content:
 *                       type: string
 *                       example: "사랑하는 00아, 생일 진심으로 축하해! \n\n일 년 중 가장 소중하고 기쁜 오늘, 네가 누구보다 행복한 시간 보냈으면 좋겠어. 맛있는 음식도 많이 먹고, 네 주변이 온통 기분 좋은 일들로만 가득 채워지는 따뜻한 하루가 되길 바랄게. \n\n항상 밝게 웃는 네 모습이 정말 보기 좋아. 오늘만큼은 세상에서 가장 행복한 주인공이 되어 마음껏 누리는 즐거운 하루 보내길 바라. 다시 한번 생일 축하해!"
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: 서버 에러 (AI 생성 실패)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 data:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "AI 문구 생성에 실패했습니다."
 */

// ai 문구 변환 api
router.post('/ai/generate', async (req: Request, res: Response) => {
  try {
    const { category, tone, draft_content } = req.body;

    // 서비스 호출
    const aiContent = await letterService.generateAiContent(category, tone, draft_content);

    // 성공 응답
    res.status(200).json({
      success: true,
      data: { ai_content: aiContent },
      meta: null,
      error: null
    });
  } catch (error: any) {
    console.error("AI 생성 중 에러 발생:", error);
    res.status(500).json({
      success: false,
      data: null,
      meta: null,
      error: error.message || "AI 문구 생성에 실패했습니다."
    });
  }
});

// 편지 최종 및 링크 생성 api
router.post('/', async (req: Request, res: Response) => {
  try {
    const result = await createLetter.createLetter(req.body);

    res.status(201).json({
      success: true,
      data: result,
      meta: null,
      error: null
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message || "편지 저장 중 오류가 발생했습니다."
    });
  }
});

export default router;