export const copy = {
  greeting: "Chào bạn, mình là Vũ!",
  hero: "Mình sắp tốt nghiệp rồi. Giữa nhiều điều muốn nói trong ngày ấy, có một lời mời mình muốn gửi đến bạn: đến chung vui với mình nhé. Mình mong sẽ có một tấm hình có cả bạn, và một cuộc trò chuyện không cần vội.",
  campus: "Có những điều chỉ khi sắp bước sang một chặng đường mới, mình mới muốn dừng lại để nhìn lâu hơn. Ngày tốt nghiệp là một dịp như thế — để vui, để biết ơn và để gặp những người mình quý.",
  event: "Nếu sắp xếp được thời gian, bạn ghé chung vui với mình nhé. Mình để thông tin buổi lễ ở đây để bạn tiện lưu lại. Ngày hiện là dự kiến; có giờ chính thức, mình sẽ cập nhật trên thiệp.",
  letter: [
    "Chào bạn, cảm ơn vì đã mở lời mời này. Mình đã nghĩ về ngày tốt nghiệp và nhận ra: điều mình mong đợi không chỉ là khoảnh khắc nhận bằng, mà còn là được gặp những người mình quý trong ngày hôm ấy.",
    "Vậy nên, mình muốn mời bạn đến chung vui. Không cần một món quà hay một lời chúc thật trau chuốt đâu. Bạn ghé qua, gọi mình một tiếng, rồi tụi mình chụp cùng nhau một tấm hình — với mình, như thế đã rất vui rồi.",
    "Nếu có thời gian, mình mong tụi mình sẽ đứng lại nói chuyện một chút. Kể nhau nghe dạo này thế nào, cười với nhau vài câu, để sau này nhìn lại tấm ảnh, mình còn nhớ cả cuộc gặp hôm ấy.",
    "Còn nếu bạn ở xa hoặc bận việc, đừng ngại nhé. Bạn có thể để lại vài dòng ở bên dưới. Dài hay ngắn đều được, chỉ cần là điều bạn muốn nói. Mình sẽ đọc và trân trọng từng lời nhắn.",
    "Cảm ơn bạn vì đã dành thời gian cho mình. Dù gặp nhau ở buổi lễ hay qua một lời chúc từ xa, mình vẫn rất vui vì có bạn cùng chia sẻ cột mốc này.",
  ],
  rsvp: "Bạn cho mình biết có thể đến không nhé. Nếu chưa chắc lịch, bạn cứ liên hệ trực tiếp với mình. Không đến được cũng không sao — lời nhắn ở đây chỉ gửi riêng cho Vũ.",
  wishes: "Bạn có thể chọn một gợi ý bên dưới hoặc viết bằng lời của riêng mình. Lời nhắn mặc định là riêng tư; nếu muốn chia sẻ với mọi người, bạn có thể chủ động đồng ý công khai. Vũ sẽ duyệt trước khi lời chúc hiện lên trang.",
  photo: "Hai tấm hình này vẫn còn thiếu một điều: một tấm có bạn đứng cạnh. Nếu hôm ấy gặp nhau, nhớ gọi mình lại chụp hình nhé. Mình muốn giữ cả niềm vui của cuộc gặp trong tấm ảnh ấy.",
  coffee: "Bạn đến chung vui hoặc gửi một lời nhắn thôi đã là một món quà rồi. Nếu vẫn muốn mời mình một ly cà phê cho chặng đường mới, mình xin nhận và cảm ơn bạn thật nhiều. Hoàn toàn tùy bạn nhé.",
  closing: "Cảm ơn bạn đã đọc đến đây. Mình mong ngày ấy sẽ có dịp gặp bạn, nhưng dù bạn ở đâu, mình cũng chúc bạn có những ngày bình an, làm điều mình yêu thích và luôn có người để chia sẻ niềm vui.",
} as const;

export const wishIdeas = [
  { label: "Chân thành", message: "Chúc mừng Vũ tốt nghiệp nhé! Chúc bạn bước vào chặng đường mới với thật nhiều niềm vui, giữ được sự tử tế và tìm thấy công việc mình yêu thích." },
  { label: "Nhẹ nhàng", message: "Chúc Vũ đủ bình tĩnh trước những điều chưa biết, đủ can đảm để thử và đủ dịu dàng với chính mình khi mọi thứ chưa như ý. Mừng ngày tốt nghiệp của bạn!" },
  { label: "Vui một chút", message: "Chúc mừng tân cử nhân Vũ! Mong những ngày tới có việc hay để làm, có tiền đi cà phê và có nhiều lý do để cười. Hôm nào gặp nhớ chụp chung một tấm nhé!" },
  { label: "Gửi từ xa", message: "Hôm ấy mình chưa thể đến, nhưng vẫn muốn gửi Vũ một lời chúc thật vui. Chúc mừng bạn tốt nghiệp! Hẹn một dịp gần nhất để nghe bạn kể về ngày này nhé." },
  { label: "Cho chặng đường mới", message: "Mong Vũ sẽ gặp những người đồng hành tốt, có cơ hội học điều mới và dần xây được cuộc sống mình mong muốn. Cứ đi từng bước thôi nhé. Chúc mừng bạn!" },
  { label: "Ngắn mà thật lòng", message: "Chúc mừng Vũ nhé! Mình vui vì được chia sẻ cột mốc này với bạn. Chúc bạn khỏe, bình an và luôn có điều để mong chờ ở phía trước." },
] as const;

export const wishesForGuests = [
  { title: "Bình an trong những ngày thường", text: "Mong bạn có sức khỏe, có một giấc ngủ ngon và có nơi để trở về sau một ngày mệt. Những điều nhỏ ấy cũng đáng để mình chúc nhau." },
  { title: "Can đảm cho những khởi đầu", text: "Nếu bạn cũng đang bắt đầu điều gì mới, mình chúc bạn đủ tự tin để thử. Chưa biết hết đường đi cũng không sao, mình cứ bước từng chút một." },
  { title: "Có người cùng chia sẻ", text: "Mong lúc vui bạn có người để kể, lúc buồn có người chịu ngồi nghe. Còn hôm nay, cảm ơn vì đã dành một chút thời gian để chia vui với mình." },
] as const;
