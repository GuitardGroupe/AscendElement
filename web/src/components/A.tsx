{/* CONTENT */ }
<div className="absolute inset-0 flex flex-col px-5 py-5 pointer-events-none">
    <Title label={CONST_TITLE} />
    {/* UI AREAS */}
    <div className="flex flex-col flex-1">
        {/* OPPONENT AREA */}
        <div className="flex-1 flex flex-col justify-end pb-15 gap-2">
            {/* OPPONENT ENERGY */}
            <div className="flex justify-end">
                <div className="flex justify-start w-[40%]">
                    <EnergyBar
                        current={opponentEnergy}
                        max={CONST_OPPONENT_MAX_ENERGY}
                    />
                </div>
            </div>
            <div className="flex items-center justify-between">
                {/* OPPONENT BUFFS */}
                <div className="flex flex-1 justify-start text-xs text-white/60">
                    {/* OPPONENT BUFFS */}
                </div>
                {/* OPPONENT HEALTH */}
                <div className="flex-1 flex justify-end">
                    <HealthBar
                        current={opponentHealth}
                        max={CONST_OPPONENT_MAX_HP}
                    />
                </div>
            </div>
            {/* OPPONENT NAME */}
            <div className="mr-5 flex justify-end text-l font-semibold">
                {opponentName}
            </div>
            {/* OPPONENT CASTBAR  */}
            <div className="flex items-center justify-center">
                <div className="w-[30%] ">
                    <CastBar progress={85} />
                </div>
            </div>
        </div>

        {/* PLAYER AREA */}
        <div className="flex-1 flex flex-col justify-start pt-15 gap-2">
            {/* PLAYER CASTBAR */}
            <div className="flex items-center justify-center">
                <div className="w-[30%] ">
                    <CastBar progress={50} />
                </div>
            </div>
            {/* PLAYER NAME */}
            <div className="flex items-center justify-center">
                <div className="ml-5 flex-1 text-l font-semibold">
                    {playerName}
                </div>
            </div>
            <div className="flex items-center justify-between">
                {/* PLAYER HEALTH */}
                <div className="flex-1 flex justify-start">
                    <HealthBar
                        current={playerHealth}
                        max={selectedCharacter?.stat_hp ?? 100}
                    />
                </div>
                {/* PLAYER BUFFS */}
                <div className="flex flex-1 justify-end text-xs text-white/60">
                    {/* PLAYER BUFFS */}
                </div>
            </div>
            {/* PLAYER ENERGY */}
            <div className="flex justify-start w-[40%]">
                <EnergyBar
                    current={playerEnergy}
                    max={selectedCharacter?.stat_energy ?? 50}
                />
            </div>
            {/* SKILLS */}
            <div className="flex-1 flex items-end justify-between gap-3 pt-2">
                {/* FLEE */}
                <button
                    onClick={handleFlee}
                    className="pointer-events-auto w-16 h-16 rounded-xl bg-red-700/80 border border-red-400/80 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(255,0,0,0.6)] active:scale-95"
                >
                    {CONST_LABEL_FLEE}
                </button>
                <SkillGrid
                    skills={{
                        simple: CONST_ASSETS.IMAGES.SKILL_1,
                        control: CONST_ASSETS.IMAGES.SKILL_3,
                        weapon: CONST_ASSETS.IMAGES.SKILL_WEAPON,
                        heavy: CONST_ASSETS.IMAGES.SKILL_2,
                        injector: CONST_ASSETS.IMAGES.SKILL_INFUSOR,
                        ultimate: CONST_ASSETS.IMAGES.SKILL_4,
                    }}
                    onSkill={(type) => handleSkill(type)}
                />
            </div>
        </div>
    </div>
</div>