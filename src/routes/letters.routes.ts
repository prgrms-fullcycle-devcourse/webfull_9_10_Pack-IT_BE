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

/**
 * @openapi
 * /letters:
 *   post:
 *     summary: 편지 최종 저장 및 링크 생성 api
 *     description: AI로 다듬어진 문구와 선택한 테마를 포함하여 최종 편지 데이터를 DB에 저장하고, 링크 생성할 때 필요한 편지 고유 ID를 반환합니다.
 *     tags:
 *       - Letters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sender_name
 *               - receiver_name
 *               - category
 *               - content
 *               - theme
 *               - password
 *             properties:
 *               sender_id:
 *                 type: integer
 *                 nullable: true
 *                 description: "로그인한 사용자의 경우 유저 고유 ID (비회원은 null)"
 *                 example: 1
 *               sender_name:
 *                 type: string
 *                 description: "보내는 사람 이름"
 *                 example: "정화"
 *               receiver_name:
 *                 type: string
 *                 description: "받는 사람 이름"
 *                 example: "민수"
 *               category:
 *                 type: string
 *                 description: "편지 카테고리"
 *                 example: "생일"
 *               content:
 *                 type: string
 *                 description: "최종 편지 내용 (AI가 다듬어준 문구 포함)"
 *                 example: "민수야, 생일 정말 축하해! 맛있는 거 많이 먹어!."
 *               theme:
 *                 type: number
 *                 description: "선택한 편지 테마 번호 (1~5)"
 *                 example: 1
 *               password:
 *                 type: number
 *                 description: "발신자가 설정한 비밀번호"
 *                 example: 9999
 *     responses:
 *       201:
 *         description: 편지 저장 및 링크 생성 성공
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
 *                     letter_id:
 *                       type: string
 *                       description: "공유 링크로 사용될 고유 nanoid"
 *                       example: "V1StG_K9_D9W9SpgS8"
 *                     published_at:
 *                       type: string
 *                       format: date-time
 *                       description: "편지 생성 일시"
 *                       example: "2026-04-28T14:41:59Z"
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       500:
 *         description: 서버 에러 (DB 저장 실패 등)
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
 *                   example: "편지 저장에 실패했습니다."
 */

/**
 * @openapi
 * /letters/{letter_id}:
 *   get:
 *     summary: 편지 상세 조회 (수신자용)
 *     description: 수신자가 전달받은 링크(letter_id)를 통해 편지의 상세 내용을 조회합니다.
 *     tags:
 *       - Letters
 *     parameters:
 *       - in: path
 *         name: letter_id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 편지의 고유 ID (nanoid)
 *         example: "e9BAYFSMDiB7X1-Sg0Ozy"
 *     responses:
 *       200:
 *         description: 편지 조회 성공
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
 *                     id:
 *                       type: string
 *                       example: "e9BAYFSMDiB7X1-Sg0Ozy"
 *                     senderId:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     senderName:
 *                       type: string
 *                       example: "정화"
 *                     receiverName:
 *                       type: string
 *                       example: "지수"
 *                     category:
 *                       type: string
 *                       example: "생일"
 *                     content:
 *                       type: string
 *                       example: "지수야, 생일 축하해. 오늘 하루 즐겁게 보내고 맛있는 것도 많이 먹었으면 좋겠다. 좋은 하루 보내!"
 *                     theme:
 *                       type: number
 *                       example: 1
 *                     publishedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-04-28T13:08:29.405Z"
 *                 meta:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: 해당 편지를 찾을 수 없음
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
 *                   example: "해당 편지를 찾을 수 없습니다."
*       500:
 *         description: 서버 오류
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
 *                   example: "서버 내부 오류가 발생했습니다."
 */


import { Router, type Request, type Response } from 'express';
import * as letterService from '../services/ai.service.js';
import * as createLetter from '../services/letter.service.js';

const router: Router = Router();

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
      meta: null,
      error: error.message || "편지 저장 중 오류가 발생했습니다."
    });
  }
});

// 편지 상세 조회 api (수신자용)
router.get('/:letter_id', async (req: Request, res: Response) => {
  try {
    const letterId = req.params.letter_id as string; // URL 파라미터에서 추출

    if (!letterId) {
      return res.status(400).json({ success: false, error: "편지 아이디가 필요합니다." });
    }

    // 서비스 계층 호출
    const letter = await createLetter.getLetterDetail(letterId);

    res.status(200).json({
      success: true,
      data: letter,
      meta: null,
      error: null
    });
  } catch (error: any) {
    // 편지가 없거나 DB 에러가 난 경우
    res.status(error.status || 500).json({
      success: false,
      data: null,
      meta: null,
      error: error.message || "편지를 불러오는 중 오류가 발생했습니다."
    });
  }
});

export default router;